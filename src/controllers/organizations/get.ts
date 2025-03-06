import type { UserSchema } from "../../schema/index.js"
import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, ORGWithRelarionSchema } from "../../schema/index.js"
import { OrganizationServiceContext } from "../../services/organization/index.js"
import * as UserErrors from "../../types/error/user-errors.js"
// import * as Errors from "../../types/error/ORG-errors.js"

export function setupORGGetRoutes() {
  const app = new Hono()

  const getManyResponseSchema = S.Array(ORGWithRelarionSchema.Schema.omit("deletedAt"))

  const getManyDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getManyResponseSchema),
          },
        },
        description: "Get Organization",
      },
      500: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Get Many Organization Error",
      },
    },

    tags: ["Organization"],
  })

  app.get("/", authMiddleware, getManyDocs, async (c) => {
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

    const program = OrganizationServiceContext.pipe(
      Effect.tap(() =>
        getUserPayload.role === "User_Admin"
          ? Effect.void
          : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
      ),
      Effect.tap(() => Effect.log("start finding many Organization")),
      Effect.andThen(svc => svc.findMany()),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        findManyORGError: () => Effect.succeed(c.json({ message: "find many error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /.organization.controller /"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  const getByIdResponseSchema = ORGWithRelarionSchema.Schema.omit("deletedAt")

  const getByIdDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getByIdResponseSchema),
          },
        },
        description: "Get Organization by Id",
      },
      404: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Get Organization By Id Not Found",
      },
    },
    tags: ["Organization"],
  })

  const validateORGRequest = validator("param", S.Struct({
    ORGId: Branded.OrganizationIdFromString,
  }))

  app.get("/:ORGId", authMiddleware, getByIdDocs, validateORGRequest, async (c) => {
    const { ORGId } = c.req.valid("param")
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

    const program = OrganizationServiceContext.pipe(
      Effect.tap(() =>
        getUserPayload.role === "User_Admin"
          ? Effect.void
          : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
      ),

      Effect.tap(() => Effect.log("start finding by Id Organization")),
      Effect.andThen(svc => svc.findById(ORGId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.andThen(b => b),
      Effect.catchTags({
        findORGByIdError: () => Effect.succeed(c.json({ message: "find by Id Error" }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: `not found Id: ${ORGId}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /userId.Organization.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })
  return app
}
