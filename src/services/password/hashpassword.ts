import argon2 from "argon2"
import { Context, Effect, Layer } from "effect"
import * as Errors from "../../types/error/user-errors.js"

function hashedPassword(password: string): Effect.Effect<string, Errors.HashedPasswordError> {
  return Effect.tryPromise({
    catch: Errors.HashedPasswordError.new(),
    try: () => argon2.hash(password),
  })
}

function isValidPassword(hashedPassword: String, password: string)

export class PasswordServiceContext extends Context.Tag("service/Password")<PasswordServiceContext, { hashedPassword: (password: string) => Effect.Effect<string, Errors.HashedPasswordError> }>() {
  static Live = Layer.effect(
    this,
    Effect.Do.pipe(
      Effect.andThen(() => {
        return {
          hashedPassword: (password: string) => hashedPassword(password).pipe(
            Effect.withSpan("hashpassword.user.service"),
          ),
        }
      }),
    ),
  )
}
