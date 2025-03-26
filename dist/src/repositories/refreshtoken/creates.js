import { Effect } from "effect";
import { Helpers, RefreshTokenSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/refreshtoken-errors.js";
export function create(prismaClient) {
    return data => Effect.tryPromise({
        catch: Errors.createRefreshTokenError.new(),
        try: () => prismaClient.refreshtokens.create({
            data,
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)), Effect.withSpan("create.refreshtoken.repository"));
}
