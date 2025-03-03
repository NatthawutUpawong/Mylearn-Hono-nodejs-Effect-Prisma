import { Effect } from "effect";
import { Helpers, ProjectWithRelationsSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/projectRelation-errors.js";
export function create(prismaClient) {
    return data => Effect.tryPromise({
        catch: Errors.createProjectRelationtError.new(),
        try: () => prismaClient.projectRelation.create({
            data,
            include: {
                project: true,
            },
        }),
    }).pipe(
    // Effect.tap(b => console.log("repo", b)),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectWithRelationsSchema.Schema)), 
    // Effect.tap(b => console.log("repo", b)),
    Effect.withSpan("create.projectRelation.repository"));
}
