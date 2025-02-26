/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Schema = S.Struct({
    id: Branded.OrganizationId,
    name: S.String,
    ...GeneralSchema.TimeStampSchema.fields,
      _tag: S.Literal("Organization").pipe(S.optional, S.withDefaults({
        constructor: () => "Organization" as const,
        decoding: () => "Organization" as const,
      })),
})

export type Organization = S.Schema.Type<typeof Schema>
export type organizationEncoded = S.Schema.Type<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type OrganizationArray = S.Schema.Type<typeof SchemaArray>
export type OrganizationArrayEncoded = S.Schema.Encoded<typeof SchemaArray>

export const CreateSchema = Schema.pick("name")
export type CreateOrganization= S.Schema.Type<typeof CreateSchema>
export type CreateOrganizationEncoded = S.Schema.Encoded<typeof CreateSchema>

export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt")
export type UpdateOrganization = S.Schema.Type<typeof UpdateSchema>
export type UpdateOrganizationEncoded = S.Schema.Encoded<typeof UpdateSchema>