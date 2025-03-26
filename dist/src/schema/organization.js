/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema";
import * as Branded from "./branded.js";
import * as GeneralSchema from "./general.js";
export const Schema = S.Struct({
    id: Branded.OrganizationId,
    name: S.String,
    ...GeneralSchema.TimeStampSchema.fields,
    _tag: S.Literal("Organization").pipe(S.optional, S.withDefaults({
        constructor: () => "Organization",
        decoding: () => "Organization",
    })),
});
export const SchemaArray = S.Array(Schema);
export const CreateSchema = Schema.pick("name");
export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt");
