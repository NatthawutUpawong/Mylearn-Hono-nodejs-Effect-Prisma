import { Effect } from "effect";
import { Helpers, UserSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/user-errors.js";
export function update(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.UpdateUserErro.new(),
        try: () => prismaClient.users.update({
            data,
            where: {
                deletedAt: null,
                id
            }
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("update.user.repository"));
}
export function updateByAdmin(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.UpdateUserErro.new(),
        try: () => prismaClient.users.update({
            data,
            where: {
                deletedAt: null,
                id
            }
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(UserSchema.UpdateByAdminSchema)), Effect.withSpan("update.user-by-admin.repository"));
}
export function updateByUser(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.UpdateUserErro.new(),
        try: () => prismaClient.users.update({
            data,
            where: {
                deletedAt: null,
                id
            }
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(UserSchema.UpdateByUserSchema)), Effect.withSpan("update.user-by-admin.repository"));
}
export function updatePartial(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.UpdateUserErro.new(),
        try: () => prismaClient.users.update({
            data,
            where: {
                deletedAt: null,
                id
            }
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("updatePartial.user.repository"));
}
