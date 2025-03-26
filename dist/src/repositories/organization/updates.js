import { Effect } from "effect";
import { Helpers, OrganizationSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/ORG-errors.js";
export function update(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.updateORGError.new(),
        try: () => prismaClient.organizations.update({
            data,
            where: {
                deletedAt: null,
                id
            }
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)), Effect.withSpan("update.user.repository"));
}
export function updatePartial(prismaClient) {
    return (id, data) => Effect.tryPromise({
        catch: Errors.updateORGError.new(),
        try: () => prismaClient.organizations.update({
            data,
            where: {
                deletedAt: null,
                id
            }
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)), Effect.withSpan("updatePartial.user.repository"));
}
