import { Effect } from "effect";
import { Helpers, UserSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/user-errors.js";
export function findMany(prismaClient) {
    return () => Effect.tryPromise({
        catch: Errors.FindManyUserError.new(),
        try: () => prismaClient.user.findMany({
            where: {
                deletedAt: null,
            },
        }),
    }).pipe(Effect.tap(b => console.log(b)), Effect.andThen(Helpers.fromObjectToSchema(UserSchema.SchemaArray)), Effect.withSpan("find-many.user.repository"));
}
export function findById(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.FindUserByIdError.new(),
        try: () => prismaClient.user.findUnique({
            where: {
                deletedAt: null,
                id,
            },
        }),
    }).pipe(Effect.andThen(Effect.fromNullable), Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("find-by-id.user.repository"));
}
export function findallById(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.FindUserByIdError.new(),
        try: () => prismaClient.user.findUnique({
            where: {
                id,
            },
        }),
    }).pipe(Effect.andThen(Effect.fromNullable), Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("find-by-id.user.repository"));
}
export function findByusername(prismaClient) {
    return username => Effect.tryPromise({
        catch: Errors.FindUserByUsernameError.new(),
        try: () => prismaClient.user.findUnique({
            where: {
                deletedAt: null,
                username,
            },
        }),
    }).pipe(Effect.andThen(Effect.fromNullable), Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)), Effect.withSpan("find-by-username.username.repository"));
}
