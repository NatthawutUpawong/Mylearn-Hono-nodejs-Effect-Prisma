import type { UserSchema } from "../../schema/index.js"
import { config } from "@dotenvx/dotenvx"
import { Effect } from "effect"
import { setCookie } from "hono/cookie"
import jwt from "jsonwebtoken"
import * as Errors from "../../types/error/user-errors.js"

config()
// eslint-disable-next-line node/prefer-global/process
const secretKey = process.env.SECRET_KEY ?? "default_secret"

function SignTokenWihtPayload(data: UserSchema.UserPayloadEncode): Effect.Effect<string, Errors.SignTokenError> {
  return Effect.try({
    catch: Errors.SignTokenError.new(),
    try: () => jwt.sign(data, secretKey, { algorithm: "HS256", expiresIn: "5m" }),
  })
}

function SignToken(): Effect.Effect<string, Errors.SignTokenError> {
  return Effect.try({
    catch: Errors.SignTokenError.new(),
    try: () => jwt.sign({}, secretKey, { algorithm: "HS256", expiresIn: "7d" }),
  })
}

function VerifyToken(token: string): Effect.Effect<string | jwt.JwtPayload, Errors.VerifyTokenError> {
  return Effect.try({
    catch: Errors.VerifyTokenError.new(),
    try: () => jwt.verify(token, secretKey),
  })
}

function SetTokenCookie(c: any, name: string, token: string, age: number) {
  return Effect.try({
    catch: Errors.SetCookieError.new(),
    try: () => setCookie(c, name, token, {
      httpOnly: true,
      maxAge: age,
      sameSite: "Strict",
      secure: true,
    }),
  })
}

export class JwtServiceContext extends Effect.Service<JwtServiceContext>()("service/Jwt", {
  effect: Effect.Do.pipe(
    Effect.andThen(() => {
      return {
        SetTokenCookie: (c: any, name: string, token: string, age: number) => SetTokenCookie(c, name, token, age).pipe(
          Effect.withSpan("SetCookie.user.service"),
        ),
        SignToken: () => SignToken().pipe(
          Effect.withSpan("signtoken.user.service"),
        ),
        SignTokenWihtPayload: (data: UserSchema.UserPayloadEncode) => SignTokenWihtPayload(data).pipe(
          Effect.withSpan("SignTokenWihtPayload.user.service"),
        ),
        VerifyToken: (token: string) => VerifyToken(token).pipe(
          Effect.withSpan("verifytoken.user.service"),
        ),
      }
    }),
  ),
}) {}
