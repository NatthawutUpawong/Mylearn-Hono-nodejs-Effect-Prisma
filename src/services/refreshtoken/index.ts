import type { RefreshTokenService } from "../../types/services/refreshtoken.js"
import { Context, Effect, Layer } from "effect"
import { RefreshTokenRepositoryContext } from "../../repositories/refreshtoken/index.js"

export class RefreshTokenServiceContext extends Context.Tag("service/refreshtoken")<RefreshTokenRepositoryContext, RefreshTokenService>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      repo: RefreshTokenRepositoryContext,
    }).pipe(
      Effect.andThen(({ repo }) => {
        return {
          create: data => repo.create(data).pipe(
            Effect.withSpan("create.refreshtoken.service"),
          ),
          findByToken: token => repo.findByToken(token).pipe(
            Effect.withSpan("find-by-token.refreshtoken.service"),
          ),
          findByUserId: id => repo.findByUserId(id).pipe(
            Effect.withSpan("find-by-id.refreshtoken.service"),
          ),
          findMany: () => repo.finManyWithRelation().pipe(
            Effect.withSpan("find-by-token.refreshtoken.service"),
          ),
          findManyPagination: (limit, offset, page) =>
            repo.findManyPagination(limit, offset).pipe(
              Effect.andThen(data =>
                repo.count().pipe(
                  Effect.andThen((totalItems) => {
                    const totalPages = Math.ceil(totalItems / limit)
                    const nextPage = page < totalPages
                      ? `http://localhost:3000/ORG?page=${page + 1}&itemPerpage=${limit}`
                      : `null`
                    const prevPage = page > 1
                      ? `http://localhost:3000/ORG?page=${page - 1}&itemPerpage=${limit}`
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
              Effect.withSpan("find-pagination.refreshtoken.service"),
            ),
          hardRemoveById: id => repo.hardRemoveById(id).pipe(
            Effect.withSpan("remove-by-id.refreshtoken.service"),
          ),
          hardRemoveByUserId: id => repo.hardRemoveByUserId(id).pipe(
            Effect.withSpan("remove-by-user-id.refreshtoken.service"),
          ),
          update: (id, data) => repo.update(id, data).pipe(
            Effect.withSpan("update.refreshtoken.service"),
          ),
        } satisfies RefreshTokenService
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
