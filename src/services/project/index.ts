import type { ProjectService } from "../../types/services/project.js"
import { Context, Effect, Layer } from "effect"
import { ProjectRepositoryContext } from "../../repositories/project/index.js"

export class ProjectServiceContext extends Context.Tag("service/Project")<ProjectRepositoryContext, ProjectService>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      repo: ProjectRepositoryContext,
    }).pipe(
      Effect.andThen(({ repo }) => {
        return {
          create: data => repo.create(data).pipe(
            Effect.withSpan("create.Project.service"),
          ),
          findById: id => repo.findByIdWithRelation(id).pipe(
            Effect.withSpan("find-by-id-withrelation.project.service"),
          ),
          findMany: () => repo.findManyWithRelations().pipe(
            Effect.withSpan("findmany-withrelation.project.service"),
          ),
          remove: id => repo.hardRemove(id).pipe(
            Effect.withSpan("remove.project.service"),
          ),
          update: (id, data) => repo.update(id, data).pipe(
            Effect.withSpan("update.project.service"),
          ),
        } satisfies ProjectService
      }),
    ),
  )

  // static Test = Layer.succeed(this, EmployeeServiceContext.of({
  //   create: (data: EmployeeSchema.CreateEmployeeEncoded) => Effect.succeed(EmployeeSchema.Schema.make({
  //     ...data,
  //     _tag: "Employee",
  //     createdAt: new Date("2024-12-30"),
  //     deletedAt: null,
  //     id: Branded.EmployeeId.make(1),
  //     updatedAt: new Date("2024-12-30"),
  //   })),
  //   findMany: () => Effect.succeed([]),
  //   findOneById: () => Effect.fail(Errors.FindEmployeeByIdError.new()()),
  //   removeById: () => Effect.fail(Errors.RemoveEmployeeError.new()()),
  //   update: () => Effect.fail(Errors.UpdateEmployeeError.new()()),
  // }))
}
