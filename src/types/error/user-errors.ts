import {Data} from "effect"
import { createErrorFactory, type ErrorMsg } from "../error.helpers.js"


export class CreateUserError extends Data.TaggedError("CreateUserError")<ErrorMsg> {
    static new = (msg?: string) => (error?: unknown) => new CreateUserError({ error, msg})
}

export class FindUserByIdError extends Data.TaggedError("FindUserByIdError")<ErrorMsg> {
    static new =  createErrorFactory(this)
}

export class FindManyUserError extends Data.TaggedError("FindManyUserError")<ErrorMsg> {
    static new =  createErrorFactory(this)
}

export class FindUserByUsernameError extends Data.TaggedError("FindUserByUsernameError")<ErrorMsg> {
    static new =  createErrorFactory(this)
}

export class UpdateUserErro extends Data.TaggedError("UpdateUserErroe")<ErrorMsg> {
    static new =  createErrorFactory(this)
}

export class GetProfileUserError extends Data.TaggedError("GetProfileUserError")<ErrorMsg> {
    static new =  createErrorFactory(this)
}

export class RemoveUserError extends Data.TaggedError("RemoveUserError")<ErrorMsg> {
    static new =  createErrorFactory(this)
}

export class LoginUserError extends Data.TaggedError("LoginUserError")<ErrorMsg> {
    static new =  createErrorFactory(this)
}

export class LogoutUserError extends Data.TaggedError("LogoutUserError")<ErrorMsg> {
    static new =  createErrorFactory(this)
}