import * as S from "effect/Schema";
import { ProjectRelarionSchema, ProjectSchema } from "./index.js";
export const Schema = S.Struct({
    ...ProjectRelarionSchema.Schema.fields,
    project: ProjectSchema.Schema.omit("deletedAt"),
});
export const SchemaArray = S.Array(Schema);
