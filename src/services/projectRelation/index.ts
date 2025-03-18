import type { ProjectRelationService } from "../../types/services/projectRelation.js"
import { Context, Effect, Layer } from "effect"
import { ProjectRelationRepositoryContext } from "../../repositories/projectRelation/index.js"

export class ProjectRelationServiceContext extends Context.Tag("service/ProjectRelation")<ProjectRelationRepositoryContext, ProjectRelationService>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      repo: ProjectRelationRepositoryContext,
    }).pipe(
      Effect.andThen(({ repo }) => {
        return {
          create: data => repo.create(data).pipe(
            Effect.withSpan("create.Projectrelation.service"),
          ),
          findById: id => repo.findById(id).pipe(
            Effect.withSpan("find-by-id.projectrelation.service"),
          ),
          findMany: (whereCondition) => repo.findMany(whereCondition).pipe(
            Effect.withSpan("findmany.Projectrelation.service"),
          ),
          findManyPagination: (limit, offset, page, whereCondition) =>
            repo.findManyPagination(limit, offset, whereCondition).pipe(
              Effect.andThen(data =>
                repo.count(whereCondition).pipe(
                  Effect.andThen((totalItems) => {
                    const totalPages = Math.ceil(totalItems / limit)
                    const nextPage = page < totalPages
                      ? `http://localhost:3000/Project?page=${page + 1}&itemPerpage=${limit}`
                      : `null`
                    const prevPage = page > 1
                      ? `http://localhost:3000/Project?page=${page - 1}&itemPerpage=${limit}`
                      : `null`
                    return {
                      data,
                      pagination: {
                        itemPerpage: limit,
                        nextPage,
                        page,
                        prevPage,
                        totalPages,
                      },
                    }
                  }),
                ),
              ),
              Effect.withSpan("find-pagination.project.service"),
            ),
        } satisfies ProjectRelationService
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
