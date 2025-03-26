import * as S from "effect/Schema";
import { ProjectRelaionSchema, ProjectSchema } from "./index.js";
export const Schema = S.Struct({
    ...ProjectRelaionSchema.Schema.fields,
    project: ProjectSchema.Schema.omit("deletedAt"),
});
export const SchemaArray = S.Array(Schema);
