import * as S from "effect/Schema";
import { RefreshTokenSchema, UserSchema } from "./index.js";
export const Schema = S.Struct({
    ...RefreshTokenSchema.Schema.fields,
    user: UserSchema.Schema.omit("password", "deletedAt"),
});
export const SchemaArray = S.Array(Schema);
