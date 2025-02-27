
import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, UserSchema } from "../../schema/index.js"
import type * as Errors from "../error/user-errors.js"

export type UserService = {
  create: (data: UserSchema.CreateUser) => Effect.Effect<UserSchema.User, Errors.CreateUserError | ParseError>
  findMany: () => Effect.Effect<UserSchema.UserArray, Errors.FindManyUserError>
  findOneById: (id: Branded.UserId) => Effect.Effect<UserSchema.User, Errors.FindUserByIdError | ParseError | NoSuchElementException>
  findallById: (id: Branded.UserId) => Effect.Effect<UserSchema.User, Errors.FindUserByIdError | ParseError | NoSuchElementException>
  findByUsername: (username: Branded.UsernameType) => Effect.Effect<UserSchema.User, Errors.FindUserByUsernameError | ParseError | NoSuchElementException>
  update: (id: Branded.UserId, data: UserSchema.UpdateUser) => Effect.Effect<UserSchema.User, Errors.UpdateUserErro | ParseError>
  removeById: (id: Branded.UserId) => Effect.Effect<UserSchema.User, Errors.RemoveUserError>
}

