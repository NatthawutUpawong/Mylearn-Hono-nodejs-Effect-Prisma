/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema";
import * as Branded from "./branded.js";
import * as GeneralSchema from "./general.js";
export const Schema = S.Struct({
    id: Branded.RefreshTokenId,
    userId: Branded.UserId,
    token: S.String,
    ...GeneralSchema.TimeStampSchema.fields,
    _tag: S.Literal("Refreshtoken").pipe(S.optional, S.withDefaults({
        constructor: () => "Refreshtoken",
        decoding: () => "Refreshtoken",
    })),
});
export const SchemaArray = S.Array(Schema);
export const CreateSchema = Schema.pick("userId", "token");
export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt");
