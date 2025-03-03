import { config } from "@dotenvx/dotenvx"
import { Effect } from "effect"
import jwt from "jsonwebtoken"

import * as Errors from "../../types/error/user-errors.js"

config()

function SignToken(data: object): Effect.Effect<string, Errors.SignTokenError> {
  return Effect.try({
    catch: Errors.SignTokenError.new(),
    try: () => jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "1h" }),
  })
}

function VerifyToken(token: string): Effect.Effect<string | jwt.JwtPayload, Errors.VerifyTokenError> {
  return Effect.try({
    catch: Errors.VerifyTokenError.new(),
    try: () => jwt.verify(token, process.env.SECRET_KEY),
  })
}

export class JwtServiceContext extends Effect.Service<JwtServiceContext>()("service/Jwt", {
  effect: Effect.Do.pipe(
    Effect.andThen(() => {
      return {
        SignToken: (data: object) => SignToken(data).pipe(
          Effect.withSpan("signtoken.user.service"),
        ),
        VerifyToken: (token: string) => VerifyToken(token).pipe(
          Effect.withSpan("verifytoken.user.service"),
        ),
      }
    }),
  ),
}) {}
