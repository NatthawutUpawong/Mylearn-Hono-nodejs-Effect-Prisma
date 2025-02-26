import * as S from "effect/Schema"
import { ProjectRelarionSchema, ProjectSchema } from "./index.js"

export const Schema = S.Struct({
  ...ProjectSchema.Schema.fields,
  projectRelarion: ProjectRelarionSchema.Schema,
})

export type ProjectWithRelations = S.Schema.Type<typeof Schema>
export type ProjectWithRelationsEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type ProjectWithRelationsArray = S.Schema.Type<typeof SchemaArray>
export type ProjectWithRelationsArrayEncoded = S.Schema.Encoded<typeof SchemaArray>
