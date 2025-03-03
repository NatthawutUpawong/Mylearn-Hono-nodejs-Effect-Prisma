import { Data } from "effect";
import { createErrorFactory } from "../error.helpers.js";
export class CreateUserError extends Data.TaggedError("CreateUserError") {
    static new = (msg) => (error) => new CreateUserError({ error, msg });
}
export class HashedPasswordError extends Data.TaggedError("HashedPasswordError") {
    static new = (msg) => (error) => new HashedPasswordError({ error, msg });
}
export class VerifyPasswordError extends Data.TaggedError("VerifyPasswordError") {
    static new = (msg) => (error) => new VerifyPasswordError({ error, msg });
}
export class InvalidPasswordError extends Data.TaggedError("InvalidPasswordError") {
    static new = (msg) => (error) => new InvalidPasswordError({ error, msg });
}
// export class isPassword8CharLongError extends Data.TaggedError("isPassword8CharLongError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }
export class isPasswordContainsSpecialCharError extends Data.TaggedError("isPasswordContainsSpecialCharError") {
    static new = createErrorFactory(this);
}
export class SignTokenError extends Data.TaggedError("SignTokenError") {
    static new = createErrorFactory(this);
}
export class VerifyTokenError extends Data.TaggedError("VerifyTokenError") {
    static new = createErrorFactory(this);
}
export class FindUserByIdError extends Data.TaggedError("FindUserByIdError") {
    static new = createErrorFactory(this);
}
export class FindManyUserError extends Data.TaggedError("FindManyUserError") {
    static new = createErrorFactory(this);
}
export class FindUserByUsernameError extends Data.TaggedError("FindUserByUsernameError") {
    static new = createErrorFactory(this);
}
export class UpdateUserErro extends Data.TaggedError("UpdateUserErroe") {
    static new = createErrorFactory(this);
}
export class GetProfileUserError extends Data.TaggedError("GetProfileUserError") {
    static new = createErrorFactory(this);
}
export class RemoveUserError extends Data.TaggedError("RemoveUserError") {
    static new = createErrorFactory(this);
}
export class LoginUserError extends Data.TaggedError("LoginUserError") {
    static new = createErrorFactory(this);
}
export class LogoutUserError extends Data.TaggedError("LogoutUserError") {
    static new = createErrorFactory(this);
}
export class UsernameAlreadyExitError extends Data.TaggedError("UsernameAlreadyExitError") {
    static new = createErrorFactory(this);
}
export class IdAlreadyExitError extends Data.TaggedError("IdAlreadyExitError") {
    static new = createErrorFactory(this);
}
