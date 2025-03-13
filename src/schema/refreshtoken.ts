/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Schema = S.Struct({
    id: Branded.RefreshTokenId,
    userId: Branded.UserId,
    token: S.String,
    ...GeneralSchema.TimeStampSchema.fields,
    _tag: S.Literal("Refreshtoken").pipe(S.optional, S.withDefaults({
    constructor: () => "Refreshtoken" as const,
    decoding: () => "Refreshtoken" as const,
  })),
})

export type RefreshToken = S.Schema.Type<typeof Schema>
export type RefreshTokenEncode = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type  RefreshTokenArray = S.Schema.Type<typeof SchemaArray>
export type  RefreshTokenArrayEncode = S.Schema.Encoded<typeof SchemaArray>

export const CreateSchema = Schema.pick("userId", "token")
export type  CreateRefreshToken = S.Schema.Type<typeof CreateSchema>
export type  CreateRefreshTokenEncode = S.Schema.Encoded<typeof CreateSchema>

export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt")
export type  UpdateRefreshToken = S.Schema.Type<typeof UpdateSchema>
export type  UpdateRefreshTokenEncode = S.Schema.Encoded<typeof UpdateSchema>


