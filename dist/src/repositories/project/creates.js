import { Effect } from "effect";
import { Helpers, ProjectSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/project-errors.js";
export function create(prismaClient) {
    return data => Effect.tryPromise({
        catch: Errors.createProjectError.new(),
        try: () => prismaClient.project.create({
            data,
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)), Effect.withSpan("create.project.repository"));
}
