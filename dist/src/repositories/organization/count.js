import { Effect } from "effect";
import * as Errors from "../../types/error/ORG-errors.js";
export function count(prismaClient) {
    return () => Effect.tryPromise({
        catch: Errors.findManyORGError.new(),
        try: () => prismaClient.organizations.count({
            where: {
                deletedAt: null,
            },
        }),
    }).pipe(Effect.withSpan("count.organization.repositoty"));
}
