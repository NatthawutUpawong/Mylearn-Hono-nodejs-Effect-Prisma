import { Effect } from "effect";
import { Helpers, ProjectRelationsWithRelationsSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/projectRelation-errors.js";
export function create(prismaClient) {
    return data => Effect.tryPromise({
        catch: Errors.createProjectRelationtError.new(),
        try: () => prismaClient.projectRelations.create({
            data,
            include: {
                project: true,
            },
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(ProjectRelationsWithRelationsSchema.Schema)), Effect.withSpan("create.projectRelation.repository"));
}
