import { Effect } from "effect";
import { Helpers, ProjectSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/project-errors.js";
export function remove(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.removeProjectError.new(),
        try: () => prismaClient.projects.update({
            data: {
                deletedAt: new Date(),
            },
            where: {
                id,
            },
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)), Effect.withSpan("remove.project.repository"));
}
export function hardRemoveById(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.removeProjectError.new(),
        try: () => prismaClient.projects.delete({
            where: {
                id,
            },
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)), Effect.withSpan("hard-remove.project.repostory"));
}
