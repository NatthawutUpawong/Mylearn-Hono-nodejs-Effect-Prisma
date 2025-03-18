import type { UserService } from "../../types/services/user.js"
import { Context, Effect, Layer } from "effect"
import { UserRepositoryContext } from "../../repositories/user/index.js"

export class UserServiceContext extends Context.Tag("service/User")<UserServiceContext, UserService>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      repo: UserRepositoryContext,
    }).pipe(
      Effect.andThen(({ repo }) => {
        return {
          create: data => repo.create(data).pipe(
            Effect.withSpan("create.user.service"),
          ),
          findallById: id => repo.findallById(id).pipe(
            Effect.withSpan("find-all-by-id.user.service"),
          ),
          findByUsername: username => repo.findByUsername(username).pipe(
            Effect.withSpan("find-by-username.user.service"),
          ),
          findMany: () => repo.findMany().pipe(
            Effect.withSpan("find-many.user.service"),
          ),
          findManyPagination: (limit, offset, page) =>
            repo.findManyPagination(limit, offset).pipe(
              Effect.andThen(data =>
                repo.count().pipe(
                  Effect.andThen((totalItems) => {
                    const totalPages = Math.ceil(totalItems / limit)
                    const nextPage = page < totalPages
                      ? `http://localhost:3000/users?page=${page + 1}&itemPerpage=${limit}`
                      : `null`
                    const prevPage = page > 1
                      ? `http://localhost:3000/users?page=${page - 1}&itemPerpage=${limit}`
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
              Effect.withSpan("find-pagination.user.service"),
            ),
          findOneById: id => repo.findById(id).pipe(
            Effect.withSpan("find-by-id.user.service"),
          ),
          removeById: id => repo.remove(id).pipe(
            Effect.withSpan("remove-by-id.service"),
          ),
          update: (id, data) => repo.update(id, data).pipe(
            Effect.withSpan("update.user.service"),
          ),
          updateByAdmin: (id, data) => repo.updateByAdmin(id, data).pipe(
            Effect.withSpan("update.user-by-admin.service"),
          ),
          updateByUser: (id, data) => repo.updateByUser(id, data).pipe(
            Effect.withSpan("update.user-by-user.service"),
          ),
        } satisfies UserService
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
