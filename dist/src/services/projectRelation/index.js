import { Context, Effect, Layer } from "effect";
import { ProjectRelationRepositoryContext } from "../../repositories/projectRelation/index.js";
export class ProjectRelationServiceContext extends Context.Tag("service/ProjectRelation")() {
    static Live = Layer.effect(this, Effect.all({
        repo: ProjectRelationRepositoryContext,
    }).pipe(Effect.andThen(({ repo }) => {
        return {
            create: data => repo.create(data).pipe(Effect.withSpan("create.Projectrelation.service")),
            findById: id => repo.findById(id).pipe(Effect.withSpan("find-by-id.projectrelation.service")),
            findMany: whereCondition => repo.findMany(whereCondition).pipe(Effect.withSpan("findmany.Projectrelation.service")),
            findManyPagination: (limit, offset, page, whereCondition) => repo.findManyPagination(limit, offset, whereCondition).pipe(Effect.andThen(data => repo.count(whereCondition).pipe(Effect.andThen((totalItems) => {
                const totalPages = Math.ceil(totalItems / limit);
                const nextPage = page < totalPages
                    ? `http://localhost:3000/Project?page=${page + 1}&itemPerpage=${limit}`
                    : `null`;
                const prevPage = page > 1
                    ? `http://localhost:3000/Project?page=${page - 1}&itemPerpage=${limit}`
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
            }))), Effect.withSpan("find-pagination.project.service")),
            update: (id, data) => repo.updatePartial(id, data).pipe(Effect.withSpan("update-partial.Projectrelation.service")),
        };
    })));
}
