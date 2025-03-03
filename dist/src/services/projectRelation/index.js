import { Context, Effect, Layer } from "effect";
import { ProjectRelationRepositoryContext } from "../../repositories/projectRelation/index.js";
export class ProjectRelationServiceContext extends Context.Tag("service/ProjectRelation")() {
    static Live = Layer.effect(this, Effect.all({
        repo: ProjectRelationRepositoryContext,
    }).pipe(Effect.andThen(({ repo }) => {
        return {
            create: data => repo.create(data).pipe(Effect.withSpan("create.Projectrelation.service")),
        };
    })));
}
