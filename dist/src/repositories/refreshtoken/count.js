import { Effect } from "effect";
import * as Errors from "../../types/error/refreshtoken-errors.js";
export function count(prismaClient) {
    return () => Effect.tryPromise({
        catch: Errors.findManyRefreshTokenError.new(),
        try: () => prismaClient.refreshtokens.count({
            where: {
                deletedAt: null,
            },
        }),
    }).pipe(Effect.withSpan("count.refreshtoken.repositoty"));
}
