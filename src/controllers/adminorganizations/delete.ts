import type { UserSchema } from "../../schema/index.js"
import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, OrganizationSchema } from "../../schema/index.js"
import { OrganizationServiceContext } from "../../services/organization/index.js"
import * as ORGErrors from "../../types/error/ORG-errors.js"
import * as UserErrors from "../../types/error/user-errors.js"

const deleteUserResponseSchema = OrganizationSchema.Schema.omit("deletedAt")

const deleteUserDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(deleteUserResponseSchema),
        },
      },
      description: "Delete Organization By UserId",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Delete Organization Error",
    },
  },
  tags: ["Admin-Organization"],
})

const validateDeleteUserRequest = validator("param", S.Struct({
  OrganizationId: Branded.OrganizationIdFromString,
}))

export function setupDeleteRoutes() {
  const app = new Hono()

  app.delete("/:OrganizationId", authMiddleware, deleteUserDocs, validateDeleteUserRequest, async (c) => {
    const { OrganizationId } = c.req.valid("param")
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(deleteUserResponseSchema)

    const program = OrganizationServiceContext.pipe(
      Effect.tap(() =>
        getUserPayload.role === "User_Admin"
          ? Effect.void
          : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
      ),

      Effect.bind("deletedORG", OrganizationServiceContext =>
        OrganizationServiceContext.findById(OrganizationId).pipe(
          Effect.catchTag("NoSuchElementException", () =>
            Effect.fail(ORGErrors.findORGByIdError.new(`Not found user Id: ${OrganizationId}`)())),
        )),

      Effect.andThen(svc => svc.remove(OrganizationId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.catchTags({
        findORGByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        removeORGError: () => Effect.succeed(c.json({ message: "remove Error" }, 500)),
      }),
      Effect.withSpan("DELETE /:ORGId.organization.controller"),
    )

    const result = await ServicesRuntime.runPromise(program)

    return result
  })

  return app
}
