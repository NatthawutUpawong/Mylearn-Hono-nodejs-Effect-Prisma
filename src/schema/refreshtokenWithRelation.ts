import * as S from "effect/Schema"
import { RefreshTokenSchema, UserSchema } from "./index.js"

export const Schema = S.Struct({
  ...RefreshTokenSchema.Schema.fields,
  user: UserSchema.Schema.omit("password", "deletedAt"),
})

export type RefreshTokenWithRelations = S.Schema.Type<typeof Schema>
export type RefreshTokenWithRelationsEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type RefreshTokenWithRelationsArray = S.Schema.Type<typeof SchemaArray>
export type RefreshTokenWithRelationsArrayEncode = S.Schema.Encoded<typeof SchemaArray>
