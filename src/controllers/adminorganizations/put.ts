import type { UserSchema } from "../../schema/index.js"
import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, OrganizationSchema } from "../../schema/index.js"
import { OrganizationServiceContext } from "../../services/organization/index.js"
import * as ORGErrors from "../../types/error/ORG-errors.js"
import * as UserErrors from "../../types/error/user-errors.js"

const responseSchema = OrganizationSchema.Schema.omit("deletedAt")

const putDocss = honoOpenapi.describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(responseSchema),
        },
      },
      description: "Udate Organization",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Udate Organization Error",
    },
  },
  tags: ["Admin-Organization"],
})

const validateRequestBody = validator("json", OrganizationSchema.UpdateSchema)
const validateUpdateParam = validator("param", S.Struct({
  OrganizationId: Branded.OrganizationIdFromString,
}))

export function setupORGPutRoutes() {
  const app = new Hono()

  app.put("/:OrganizationId", authMiddleware, putDocss, validateRequestBody, validateUpdateParam, async (c) => {
    const body = c.req.valid("json")
    const { OrganizationId } = c.req.valid("param")
    const userPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      ORGService: OrganizationServiceContext,
    }).pipe(
      Effect.tap(() =>
        userPayload.role === "User_Admin"
          ? Effect.void
          : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
      ),
      Effect.tap(() => Effect.log("Update starting")),
      Effect.bind("existingORG", ({ ORGService }) => ORGService.findById(OrganizationId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(ORGErrors.findORGByIdError.new(`not found Id: ${OrganizationId}`)())),
      )),
      Effect.bind("newName", ({ existingORG }) =>
        Effect.succeed(body.name.trim() === "" ? existingORG.name : body.name)),
      Effect.tap(({ existingORG }) =>
        body.id === existingORG.id
          ? Effect.void
          : Effect.fail(ORGErrors.ORGIdNotMatchError.new("Id from param and body id not match")()),
      ),
      Effect.andThen(b => b),
      Effect.andThen(({ newName, ORGService }) => ORGService.update(OrganizationId, { ...body, name: newName })),

      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.catchTags({
        findORGByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        ORGIdNotMatchError: e => Effect.succeed(c.json({ message: e.msg }, 400)),
        ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        updateORGError: () => Effect.succeed(c.json({ message: "update failed" }, 500)),
      }),
      Effect.withSpan("PUT /ORG.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
