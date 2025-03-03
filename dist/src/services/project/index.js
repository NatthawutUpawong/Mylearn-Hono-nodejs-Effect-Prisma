import { Context, Effect, Layer } from "effect";
import { ProjectRepositoryContext } from "../../repositories/project/index.js";
export class ProjectServiceContext extends Context.Tag("service/Project")() {
    static Live = Layer.effect(this, Effect.all({
        repo: ProjectRepositoryContext,
    }).pipe(Effect.andThen(({ repo }) => {
        return {
            create: (data) => repo.create(data).pipe(Effect.withSpan("create.Project.service")),
        };
    })));
}
