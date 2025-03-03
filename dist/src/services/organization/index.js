import { Context, Effect, Layer } from "effect";
import { OrganizationRepositoryContext } from "../../repositories/organization/index.js";
export class OrganizationServiceContext extends Context.Tag("service/Organization")() {
    static Live = Layer.effect(this, Effect.all({
        repo: OrganizationRepositoryContext,
    }).pipe(Effect.andThen(({ repo }) => {
        return {
            create: data => repo.create(data).pipe(Effect.withSpan("create.Organization.service")),
            findById: id => repo.findByIdWithRelation(id).pipe(Effect.withSpan("fin-by-Id.Organization.service")),
            findMany: () => repo.findManyWithRelation().pipe(Effect.withSpan("findmany.Organization.service")),
            update: (id, data) => repo.update(id, data).pipe(Effect.withSpan("update.Organization.service")),
            remove: id => repo.hardRemove(id).pipe(Effect.withSpan("remove.Organization.service")),
        };
    })));
}
