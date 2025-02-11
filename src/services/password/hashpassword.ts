import { Context, Effect, Layer } from "effect"
import argon2 from "argon2"
import * as Errors from "../../types/error/user-errors.js"

function hashedPassword(password: string): Effect.Effect<string, Errors.hashedPasswordError> {
    return Effect.tryPromise({
        catch: Errors.hashedPasswordError.new(),
        try: () => argon2.hash(password)
    })
}

export class PasswordServiceContext extends Context.Tag("service/Password")<PasswordServiceContext, 
    {hashedPassword:(password: string) => Effect.Effect<string, Errors.hashedPasswordError>}>() {
    static Live = Layer.effect(
        this, 
        Effect.Do.pipe(
            Effect.andThen(() => {
                return {
                    hashedPassword: (password: string) => hashedPassword(password).pipe(
                        Effect.withSpan("hashpassword.user.service")
                    )
                }
            })
        )
      )
}

