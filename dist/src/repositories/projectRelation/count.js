import { Effect } from "effect";
import * as Errors from "../../types/error/projectRelation-errors.js";
export function count(prismaClient) {
    return (whereCondition) => Effect.tryPromise({
        catch: Errors.findManyProjectRelationtError.new(),
        try: () => prismaClient.projectRelations.count({
            where: {
                ...whereCondition,
            },
        }),
    }).pipe(Effect.withSpan("count.project.repositoty"));
}
