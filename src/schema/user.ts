/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Role = S.Literal("User", "User_ORG", "User_Admin")

export const Schema = S.Struct({
  id: Branded.UserId,
  username: Branded.UsernameType,
  password: S.String,
  role: Role,
  organizationId: S.NullOr(Branded.OrganizationId),
  profileImageURL: S.NullOr(S.String),
  profileImageName: S.NullOr(S.String),
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

export const UpdateByUserSchema = Schema.omit("organizationId", "role", "_tag", "createdAt", "profileImageURL", "profileImageURL", "updatedAt", "deletedAt")
export type UpdateUserByUser = S.Schema.Type<typeof UpdateByUserSchema>
export type UpdateUserByUserEncoded = S.Schema.Encoded<typeof UpdateByUserSchema>

export const UpdateImageByUserSchema = Schema.omit("organizationId", "role", "_tag", "createdAt", "updatedAt", "deletedAt")
export type UpdateUserImageByUser = S.Schema.Type<typeof UpdateImageByUserSchema>
export type UpdateUserImageByUserEncoded = S.Schema.Encoded<typeof UpdateImageByUserSchema>

export const UpdateByAdminSchema = Schema.omit("username", "password", "_tag", "profileImageURL", "profileImageURL", "createdAt", "updatedAt", "deletedAt")
export type UpdateUserByAdmin = S.Schema.Type<typeof UpdateByAdminSchema>
export type UpdateUserByAdminEncoded = S.Schema.Encoded<typeof UpdateByAdminSchema>

export const LoginSchema = Schema.pick("username", "password")
export type LoginUser = S.Schema.Type<typeof LoginSchema>
export type LoginUserEncoded = S.Schema.Encoded<typeof LoginSchema>

export const UserPayloadSchema = Schema.pick("id", "username", "role", "organizationId")
export type UserPayload = S.Schema.Type<typeof UserPayloadSchema>
export type UserPayloadEncode = S.Schema.Encoded<typeof UserPayloadSchema>
