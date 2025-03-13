import type { UserSchema } from "../schema/index.js"
import { Effect } from "effect"
import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { ServicesRuntime } from "../runtime/indext.js"
import { JwtServiceContext } from "../services/jwt/indext.js"
import * as Errors from "../types/error/user-errors.js"

export const authMiddleware = createMiddleware<{ Variables: { userPayload: UserSchema.UserPayload } }>(async (c, next) => {
  const token = getCookie(c, "AccessToken")

  const programs = Effect.succeed(token).pipe(

    Effect.andThen(token =>
      token
        ? Effect.succeed(token)
        : Effect.fail(Errors.VerifyTokenError.new("Unauthorized")()),
    ),
    Effect.andThen(token => JwtServiceContext.pipe(
      Effect.andThen(svc => svc.VerifyToken(token)),
    )),
    Effect.andThen(b => b),

    Effect.tap((decoded) => {
      c.set("userPayload", decoded as UserSchema.UserPayload)
      return Effect.void
    }),

    Effect.andThen(b => b),

    Effect.andThen(() => Effect.promise(next)),

    Effect.catchTags({
      VerifyTokenError: e => Effect.succeed(c.json({ message: e.msg }, 401)),

    }),
  )

  const result = await ServicesRuntime.runPromise(programs)
  return result
})
