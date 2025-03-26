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
            findManyPagination: (limit, offset, page) => repo.findManyPagination(limit, offset).pipe(Effect.andThen(data => repo.count().pipe(Effect.andThen((totalItems) => {
                const totalPages = Math.ceil(totalItems / limit);
                const nextPage = page < totalPages
                    ? `http://localhost:3000/ORG?page=${page + 1}&itemPerpage=${limit}`
                    : `null`;
                const prevPage = page > 1
                    ? `http://localhost:3000/ORG?page=${page - 1}&itemPerpage=${limit}`
                    : `null`;
                return {
                    data,
                    pagination: {
                        itemPerpage: limit,
                        nextPage,
                        page,
                        prevPage,
                        totalPages,
                    },
                };
            }))), Effect.withSpan("find-pagination.Organization.service")),
            update: (id, data) => repo.update(id, data).pipe(Effect.withSpan("update.Organization.service")),
            remove: id => repo.hardRemove(id).pipe(Effect.withSpan("remove.Organization.service")),
        };
    })));
}
