import { Effect } from "effect";
import { Helpers, OrganizationSchema } from "../../schema/index.js";
import * as Errors from "../../types/error/ORG-errors.js";
export function create(prismaClient) {
    return data => Effect.tryPromise({
        catch: Errors.createORGError.new(),
        try: () => prismaClient.organization.create({
            data,
        }),
    }).pipe(Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)), Effect.withSpan("create.organization.repositoty"));
}
