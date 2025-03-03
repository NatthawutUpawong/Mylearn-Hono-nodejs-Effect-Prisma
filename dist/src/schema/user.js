/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema";
import * as Branded from "./branded.js";
import * as GeneralSchema from "./general.js";
export const Role = S.Literal("User", "User_ORG", "User_Admin");
export const Schema = S.Struct({
    id: Branded.UserId,
    username: Branded.UsernameType,
    password: S.String,
    role: Role,
    organizationId: Branded.OrganizationId,
    ...GeneralSchema.TimeStampSchema.fields,
    _tag: S.Literal("User").pipe(S.optional, S.withDefaults({
        constructor: () => "User",
        decoding: () => "User",
    })),
});
export const SchemaArray = S.Array(Schema);
export const CreateSchema = Schema.pick("username", "password", "organizationId");
export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt");
export const LoginSchema = Schema.pick("username", "password");
