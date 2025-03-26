/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema";
import * as Branded from "./branded.js";
import * as GeneralSchema from "./general.js";
export const Schema = S.Struct({
    id: Branded.ProjectRelationId,
    userId: Branded.UserId,
    projectId: Branded.ProjectId,
    organizationId: S.NullOr(Branded.OrganizationId),
    ...GeneralSchema.TimeStampSchema.fields,
    _tag: S.Literal("ProjectRelation").pipe(S.optional, S.withDefaults({
        constructor: () => "ProjectRelation",
        decoding: () => "ProjectRelation",
    })),
});
export const SchemaArray = S.Array(Schema);
export const CreateSchema = Schema.pick("userId", "projectId", "organizationId");
export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt");
