import { Effect } from "effect";
import { Helpers, UserSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/user-errors.js";
export function remove(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.RemoveUserError.new(),
        try: () => prismaClient.users.update({
            data: {
                deletedAt: new Date(),
            },
            where: {
                id,
            }
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("remove.user.repository"));
}
export function hardRemoveById(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.RemoveUserError.new(),
        try: () => prismaClient.users.delete({
            where: {
                id,
            }
        })
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("hard-remove.user.repostory"));
}
