import { Effect } from "effect";
import { Helpers, RefreshTokenSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/refreshtoken-errors.js";
export function update(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.updateRefreshTokenError.new(),
        try: () => prismaClient.refreshtokens.update({
            data,
            where: {
                deletedAt: null,
                id,
            },
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)), Effect.withSpan("update.refreshtoken.repository"));
}
export function updatePartial(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.updateRefreshTokenError.new(),
        try: () => prismaClient.refreshtokens.update({
            data,
            where: {
                deletedAt: null,
                id,
            },
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)), Effect.withSpan("updatePartial.refreshtoken.repository"));
}
