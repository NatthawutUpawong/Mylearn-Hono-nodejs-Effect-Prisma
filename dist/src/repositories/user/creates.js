import { Effect } from "effect";
import { Helpers, UserSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/user-errors.js";
export function create(prismaClient) {
    return data => Effect.tryPromise({
        catch: Errors.CreateUserError.new(),
        try: () => prismaClient.users.create({
            data
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("create.user.repositoty"));
}
