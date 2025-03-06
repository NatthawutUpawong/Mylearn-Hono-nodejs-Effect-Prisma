/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Schema = S.Struct({
    id: Branded.ProjectId,
    name: S.String,
    ...GeneralSchema.TimeStampSchema.fields,
      _tag: S.Literal("Project").pipe(S.optional, S.withDefaults({
        constructor: () => "Project" as const,
        decoding: () => "Project" as const,
      })),
})

export type Project = S.Schema.Type<typeof Schema>
export type ProjectEncoded = S.Schema.Type<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type ProjectArray = S.Schema.Type<typeof SchemaArray>
export type ProjectArrayEncoded = S.Schema.Encoded<typeof SchemaArray>

export const CreateSchema = Schema.pick("name")
export type CreateProject = S.Schema.Type<typeof CreateSchema>
export type CreateProjectEncoded = S.Schema.Encoded<typeof CreateSchema>

export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt")
export type UpdateProject = S.Schema.Type<typeof UpdateSchema>
export type UpdateProjectEncoded = S.Schema.Encoded<typeof UpdateSchema>
