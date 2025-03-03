import * as S from "effect/Schema";
import { OrganizationSchema, UserSchema } from "./index.js";
export const Schema = S.Struct({
    ...OrganizationSchema.Schema.fields,
    users: S.Array(UserSchema.Schema.omit("deletedAt")),
});
export const SchemaArray = S.Array(Schema);
