import type { UserSchema } from "../schema/index.js"
import { Effect } from "effect"
import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { ServicesRuntime } from "../runtime/indext.js"
import { JwtServiceContext } from "../services/jwt/indext.js"
import * as Errors from "../types/error/user-errors.js"

export const refreshTokenMiddleware = createMiddleware<{ Variables: { userPayload: UserSchema.UserPayload } }>(async (c, next) => {
  const RefreshTokenCookie = getCookie(c, "RefreshToken")

  const programs = Effect.all({
    JwtService: JwtServiceContext,
  }).pipe(
    Effect.tap(() => console.log("process start")),

    Effect.bind("RefreshToken", () =>
      RefreshTokenCookie
        ? Effect.succeed(RefreshTokenCookie)
        : Effect.fail(Errors.VerifyTokenError.new("Unauthorized")())),
    Effect.andThen(b => b),

    Effect.tap(({ JwtService, RefreshToken }) => JwtService.VerifyToken(RefreshToken).pipe(
      Effect.catchTag("VerifyTokenError", () => Effect.fail(Errors.VerifyTokenError.new("Unauthorized")())),
    )),
    Effect.andThen(b => b),

    Effect.andThen(() => Effect.promise(next)),

    Effect.catchTags({
      VerifyTokenError: e => Effect.succeed(c.json({ message: e.msg }, 401)),

    }),
  )

  const result = await ServicesRuntime.runPromise(programs)
  return result
})
