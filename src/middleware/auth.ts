import type { Context, Next } from "hono"
import { Effect } from "effect"
import { getCookie } from "hono/cookie"
import { JwtServiceContext } from "../services/jwt/indext.js"
import * as Errors from "../types/error/user-errors.js"

export async function authMiddleware(c: Context, next: Next) {
  const token = getCookie(c, "session")
  if (!token) return c.json({ error: "Unauthorized" }, 401)

  const result = await Effect.succeed(token).pipe(
    Effect.andThen(token =>
      token
        ? Effect.succeed(token)
        : Effect.fail(Errors.VerifyTokenError.new("Unauthorized")()),
    ),
    Effect.andThen(token =>
      JwtServiceContext.pipe(
        Effect.andThen(svc => svc.VerifyToken(token)),
      ),
    ),
    Effect.catchTags({
      VerifyTokenError: (e) => Effect.succeed(c.json({ error: e.msg }, 401)),
    }),
    Effect.andThen(b => b)
  )

  if (!result) return
  c.set("user", result)
  await next()
}
