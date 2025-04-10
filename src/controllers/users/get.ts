import { config } from "@dotenvx/dotenvx"
import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { UserSchema } from "../../schema/index.js"

config()

export function setupUserGetRoutes() {
  const app = new Hono()

  const getProfileDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(UserSchema.UserPayloadSchema),
          },
        },
        description: "Get Profile",
      },
      401: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Unauthorized",
      },
    },
    tags: ["User"],
  })

  app.get("/profile", authMiddleware, getProfileDocs, async (c) => {
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const program = Effect.succeed(getUserPayload).pipe(

      Effect.andThen(User => c.json(User)),
    )

    return await ServicesRuntime.runPromise(program)
  })

  return app
}
