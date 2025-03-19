import type { UserSchema } from "../../schema/index.js"
import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Helpers, paginationSchema, RefreshTokenWithRelationSchema } from "../../schema/index.js"
import { RefreshTokenServiceContext } from "../../services/refreshtoken/index.js"
import * as UserErrors from "../../types/error/user-errors.js"

export function setupRefreshtokenGetRoutes() {
  const app = new Hono()

  const getManyResponseSchema = S.Struct({
    data: S.Array(RefreshTokenWithRelationSchema.Schema.omit("deletedAt")),
    pagination: paginationSchema.Schema,

  })

  const getManyDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getManyResponseSchema),
          },
        },
        description: "Get RefreshToken",
      },
      500: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Get Many RefreshToken Error",
      },
    },

    tags: ["Admin-RefreshToken"],
  })

  app.get("/", authMiddleware, getManyDocs, async (c) => {
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")
    const limit = Number(c.req.query("itemPerpage") ?? 10)
    const page = Number(c.req.query("page") ?? 1)
    const offset = (page - 1) * limit

    const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

    const program = RefreshTokenServiceContext.pipe(
      Effect.tap(() =>
        getUserPayload.role === "User_Admin"
          ? Effect.void
          : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
      ),
      Effect.tap(() => Effect.log("start finding many RefreshToken")),
      Effect.andThen(svc => svc.findManyPagination(limit, offset, page)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.catchTags({
        findManyRefreshTokenError: () => Effect.succeed(c.json({ message: "find many Error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /.refreshtoken.controller /"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  return app
}
