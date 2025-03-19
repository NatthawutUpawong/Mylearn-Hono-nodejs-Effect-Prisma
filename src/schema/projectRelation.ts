/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Schema = S.Struct({
  id: Branded.ProjectRelationId,
  userId: Branded.UserId,
  projectId: Branded.ProjectId,
  organizationId: S.NullOr(Branded.OrganizationId),
  ...GeneralSchema.TimeStampSchema.fields,
  _tag: S.Literal("ProjectRelation").pipe(S.optional, S.withDefaults({
    constructor: () => "ProjectRelation" as const,
    decoding: () => "ProjectRelation" as const,
  })),
})

export type ProjectRelation = S.Schema.Type<typeof Schema>
export type ProjectRelationEncoded = S.Schema.Type<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type ProjectRelationArray = S.Schema.Type<typeof SchemaArray>
export type ProjectRelationArrayEncoded = S.Schema.Encoded<typeof SchemaArray>

export const CreateSchema = Schema.pick("userId", "projectId", "organizationId")
export type CreateProjectRelation = S.Schema.Type<typeof CreateSchema>
export type CreateProjectRelationEncoded = S.Schema.Encoded<typeof CreateSchema>

export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt")
export type UpdateProjectRelation = S.Schema.Type<typeof UpdateSchema>
export type UpdateProjectRelationEncoded = S.Schema.Encoded<typeof UpdateSchema>
