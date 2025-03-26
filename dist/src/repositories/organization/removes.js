import { Effect } from "effect";
import { Helpers, OrganizationSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/ORG-errors.js";
export function remove(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.removeORGError.new(),
        try: () => prismaClient.organizations.update({
            data: {
                deletedAt: new Date(),
            },
            where: {
                id,
            },
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)), Effect.withSpan("remove.organization.repository"));
}
export function hardRemoveById(prismaClient) {
    return id => Effect.tryPromise({
        catch: Errors.removeORGError.new(),
        try: () => prismaClient.organizations.delete({
            where: {
                id,
            },
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)), Effect.withSpan("hard-remove.organizationRepository.repostory"));
}
