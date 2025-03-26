import * as S from "effect/Schema";
import { ProjectRelaionSchema, ProjectSchema } from "./index.js";
export const Schema = S.Struct({
    ...ProjectSchema.Schema.fields,
    projectRelation: S.Array(ProjectRelaionSchema.Schema.omit("deletedAt")),
});
export const SchemaArray = S.Array(Schema);
