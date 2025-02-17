import argon2 from "argon2"
import { Effect, flow, Match } from "effect"
import * as Errors from "../../types/error/user-errors.js"

function hashedPassword(password: string): Effect.Effect<string, Errors.HashedPasswordError> {
  return Effect.tryPromise({
    catch: Errors.HashedPasswordError.new(),
    try: () => argon2.hash(password),
  })
}

function isValidPassword(hashedPassword: string, password: string): Effect.Effect<boolean, Errors.VerifyPasswordError> {
  return Effect.tryPromise({
    catch: Errors.VerifyPasswordError.new(),
    try: () => argon2.verify(hashedPassword, password),
  })
}

function isPassword8CharLong(password: string): boolean{
  return password.length >= 8 && !password.includes(" ")
}

const isPassword8CharLongEffect = flow(
  isPassword8CharLong,
  Match.type<boolean>().pipe(
    Match.when(false, () => Effect.fail(Errors.InvalidPasswordError.new("Password must have at least 8 characters")())),
    Match.when(true, () => Effect.succeed(true)),
    Match.exhaustive
  )
)  

function isPasswordContainsSpecialChar(password: string): boolean {
  return  /[^a-z0-9]/i.test(password)
}

const isPasswordContainsSpecialCharEffect = flow(
  isPasswordContainsSpecialChar,
  Match.type<boolean>().pipe(
    Match.when(false, () => Effect.fail(Errors.InvalidPasswordError.new("Password must have spaccial characters")())),
    Match.when(true, () => Effect.succeed(true)),
    Match.exhaustive
  )
) 

export class PasswordServiceContext extends Effect.Service<PasswordServiceContext>() ("service/Password", {
  effect: Effect.Do.pipe(
    Effect.andThen(() => {
      return {
        hashedPassword: (password: string) => hashedPassword(password).pipe(
          Effect.withSpan("ashpassword.user.service"),
        ),

        isPassword8CharLongEffect: (password: string) => isPassword8CharLongEffect(password).pipe(
          Effect.withSpan("verify.password-lengh.service")
        ),

        isPasswordContainsSpecialCharEffect: (password: string) => isPasswordContainsSpecialCharEffect(password).pipe(
          Effect.withSpan("verify.password-lengh.service")
        ),

        isValidPassword: (hashedPassword: string, password: string) => isValidPassword(hashedPassword, password).pipe(
          Effect.withSpan("verify.password.service"),
        )
      }
    }),
  ),
}) {
}
