import * as S from "effect/Schema"
import { OrganizationSchema, UserSchema } from "./index.js"

export const Schema = S.Struct({
  ...OrganizationSchema.Schema.fields,
  users: S.Array(UserSchema.Schema.omit("deletedAt")),
})

export type ORGWithRelations = S.Schema.Type<typeof Schema>
export type ORGWithRelationsEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type ORGWithRelationsArray = S.Schema.Type<typeof SchemaArray>
export type ORGWithRelationsArrayEncoded = S.Schema.Encoded<typeof SchemaArray>
