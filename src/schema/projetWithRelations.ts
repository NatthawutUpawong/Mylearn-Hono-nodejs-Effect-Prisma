import * as S from "effect/Schema"
import { ProjectRelaionSchema, ProjectSchema } from "./index.js"

export const Schema = S.Struct({
  ...ProjectSchema.Schema.fields,
  projectRelation: S.Array(ProjectRelaionSchema.Schema.omit("deletedAt")),
})

export type ProjectWithRelations = S.Schema.Type<typeof Schema>
export type ProjectWithRelationsEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type ProjectWithRelationsArray = S.Schema.Type<typeof SchemaArray>
export type ProjectWithRelationsArrayEncoded = S.Schema.Encoded<typeof SchemaArray>
