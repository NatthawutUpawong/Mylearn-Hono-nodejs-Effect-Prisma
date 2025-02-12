import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Schema = S.Struct({
  id: Branded.UserId,
  username: S.String,
  // eslint-disable-next-line perfectionist/sort-objects
  password: S.String,
  ...GeneralSchema.TimeStampSchema.fields,
  _tag: S.Literal("User").pipe(S.optional, S.withDefaults({
    constructor: () => "User" as const,
    decoding: () => "User" as const,
  })),
})

export type User = S.Schema.Type<typeof Schema>
export type UserEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type UserArray = S.Schema.Type<typeof SchemaArray>
export type UserArrayEncoded = S.Schema.Encoded<typeof SchemaArray>

export const CreateSchema = Schema.pick("username", "password")
export type CreateUser = S.Schema.Type<typeof CreateSchema>
export type CreateUserEncoded = S.Schema.Encoded<typeof CreateSchema>

export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt")
export type UpdateUser = S.Schema.Type<typeof UpdateSchema>
export type UpdateUserEncoded = S.Schema.Encoded<typeof UpdateSchema>

export const LoginSchema = Schema.pick("username", "password")
export type LoginUser = S.Schema.Type<typeof LoginSchema>
export type LoginUserEncoded = S.Schema.Encoded<typeof LoginSchema>

export const UsernameSchema = S.String
export type UsernameLog = S.Schema.Type<typeof UsernameSchema>
export type UsernameLogEncoded = S.Schema.Encoded<typeof UsernameSchema>

export const PasswordSchema = Schema.pick("password")
export type Password = S.Schema.Type<typeof PasswordSchema>
export type PasswordEndcoded = S.Schema.Encoded<typeof PasswordSchema>
