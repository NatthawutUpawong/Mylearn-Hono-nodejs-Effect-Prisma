/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema";
import * as Branded from "./branded.js";
import * as GeneralSchema from "./general.js";
export const Schema = S.Struct({
    id: Branded.ProjectId,
    name: S.String,
    ...GeneralSchema.TimeStampSchema.fields,
    _tag: S.Literal("Project").pipe(S.optional, S.withDefaults({
        constructor: () => "Project",
        decoding: () => "Project",
    })),
});
export const SchemaArray = S.Array(Schema);
export const CreateSchema = Schema.pick("name");
export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt");
