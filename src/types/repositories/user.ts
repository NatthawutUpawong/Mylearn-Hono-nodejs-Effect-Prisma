import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, UserSchema } from "../../schema/index.js"
import type * as Errors from "../error/user-errors.js"

type User = UserSchema.User

export type UserRepository = {
  create: (data: UserSchema.CreateUserEncoded) => Effect.Effect<User, Errors.CreateUserError | ParseError>
  findById: (id: Branded.UserId) => Effect.Effect<User, Errors.FindUserByIdError | ParseError | NoSuchElementException>
  findallById: (id: Branded.UserId) => Effect.Effect<User, Errors.FindUserByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<UserSchema.UserArray, Errors.FindManyUserError>
  update: (id: Branded.UserId, data: UserSchema.UpdateUserEncoded) => Effect.Effect<User, Errors.UpdateUserErro | ParseError>
  updateByAdmin: (id: Branded.UserId, data: UserSchema.UpdateUserByAdminEncoded) => Effect.Effect<UserSchema.UpdateUserByAdmin, Errors.UpdateUserErro | ParseError>
  updateByUser: (id: Branded.UserId, data: UserSchema.UpdateUserByUserEncoded) => Effect.Effect<UserSchema.UpdateUserByUser, Errors.UpdateUserErro | ParseError>
  updatePartial: (id: Branded.UserId, data: Partial<UserSchema.UpdateUserImageByUserEncoded>) => Effect.Effect<UserSchema.UpdateUserImageByUserEncoded, Errors.UpdateUserErro | ParseError>
  remove: (id: Branded.UserId) => Effect.Effect<User, Errors.RemoveUserError>
  hardRemove: (id: Branded.UserId) => Effect.Effect<User, Errors.RemoveUserError>
  findByUsername: (username: Branded.UsernameType) => Effect.Effect<User, Errors.FindUserByUsernameError | ParseError | NoSuchElementException>
  count: () => Effect.Effect<number, Errors.FindManyUserError>
  findManyPagination: (limit: number, offset: number,) => Effect.Effect<UserSchema.UserArray, Errors.FindManyUserError>

}
