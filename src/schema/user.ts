import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Schema = S.Struct({
  id: Branded.UserId,
  password: S.String,
  username: S.String.annotations({ jsonSchema: { example: "John Doe", title: "name", type: "string" } }),
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