import argon2 from "argon2";
import { Effect, flow, Match } from "effect";
import * as Errors from "../../types/error/user-errors.js";
function hashedPassword(password) {
    return Effect.tryPromise({
        catch: Errors.HashedPasswordError.new(),
        try: () => argon2.hash(password),
    });
}
function isValidPassword(hashedPassword, password) {
    return Effect.tryPromise({
        catch: Errors.VerifyPasswordError.new("Invalided Username or Password"),
        try: () => argon2.verify(hashedPassword, password),
    });
}
// async function isValidPassword(hashedPassword: string, password: string): boolean {
//   return await argon2.verify(hashedPassword, password)
// }
// const isValidPasswordEffect = flow(
//   isValidPassword,
//   Match.type<boolean>().pipe(
//     Match.when(false, () => Effect.fail(Errors.InvalidPasswordError.new("Invalided Username or Password")())),
//     Match.when(true, () => Effect.succeed(true)),
//     Match.exhaustive,
//   )
// )
function isPassword8CharLong(password) {
    return password.length >= 8 && !password.includes(" ");
}
const isPassword8CharLongEffect = flow(isPassword8CharLong, Match.type().pipe(Match.when(false, () => Effect.fail(Errors.InvalidPasswordError.new("Password must have at least 8 characters")())), Match.when(true, () => Effect.succeed(true)), Match.exhaustive));
function isPasswordContainsSpecialChar(password) {
    return /[^a-z0-9]/i.test(password);
}
const isPasswordContainsSpecialCharEffect = flow(isPasswordContainsSpecialChar, Match.type().pipe(Match.when(false, () => Effect.fail(Errors.InvalidPasswordError.new("Password must have spaccial characters")())), Match.when(true, () => Effect.succeed(true)), Match.exhaustive));
export class PasswordServiceContext extends Effect.Service()("service/Password", {
    effect: Effect.Do.pipe(Effect.andThen(() => {
        return {
            hashedPassword: (password) => hashedPassword(password).pipe(Effect.withSpan("ashpassword.user.service")),
            isPassword8CharLongEffect: (password) => isPassword8CharLongEffect(password).pipe(Effect.withSpan("verify.password-lengh.service")),
            isPasswordContainsSpecialCharEffect: (password) => isPasswordContainsSpecialCharEffect(password).pipe(Effect.withSpan("verify.password-lengh.service")),
            isValidPassword: (hashedPassword, password) => isValidPassword(hashedPassword, password).pipe(Effect.withSpan("verify.password.service")),
        };
    })),
}) {
}
