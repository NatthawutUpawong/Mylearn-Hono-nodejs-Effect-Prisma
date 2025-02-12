import type { UserService } from "../../types/services/user.js"
import { Context, Effect, Layer } from "effect"
import { UserRepositoryContext } from "../../repositories/user/index.js"


// export function initEmployeeService(employeeRepository: EmployeeRepository): EmployeeService {
//   return {
//     create: Creates.create(employeeRepository),
//     findMany: Finds.findMany(employeeRepository),
//     findOneById: Finds.findOneById(employeeRepository),
//     removeById: Removes.removeById(employeeRepository),
//     update: Updates.update(employeeRepository),
//   }
// }

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
          findOneById: id => repo.findById(id).pipe(
            Effect.withSpan("find-by-id.user.service"),
          ),
          removeById: id => repo.remove(id).pipe(
            Effect.withSpan("remove-by-id.service")
          ),
          update: (id, data) => repo.update(id, data).pipe(
            Effect.withSpan("update.user.service"),
          ),
          login: (username, password) => repo.findByUsername(username).pipe(
              Effect.flatMap((user) => user
                ?passwordSerci)
            // Effect.withSpan("login.user.service")
          )

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
