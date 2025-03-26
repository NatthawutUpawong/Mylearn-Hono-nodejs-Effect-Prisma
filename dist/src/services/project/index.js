import { Context, Effect, Layer } from "effect";
import { ProjectRepositoryContext } from "../../repositories/project/index.js";
export class ProjectServiceContext extends Context.Tag("service/Project")() {
    static Live = Layer.effect(this, Effect.all({
        repo: ProjectRepositoryContext,
    }).pipe(Effect.andThen(({ repo }) => {
        return {
            create: data => repo.create(data).pipe(Effect.withSpan("create.Project.service")),
            findById: id => repo.findById(id).pipe(Effect.withSpan("find-by-id.project.service")),
            findMany: () => repo.findMany().pipe(Effect.withSpan("findmany.project.service")),
            remove: id => repo.hardRemove(id).pipe(Effect.withSpan("remove.project.service")),
            update: (id, data) => repo.update(id, data).pipe(Effect.withSpan("update.project.service")),
        };
    })));
}
