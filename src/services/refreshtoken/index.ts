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
          findByUserId: id => repo.findByUserId(id).pipe(
            Effect.withSpan("find-by-id-withrelation.refreshtoken.service"),
          ),
          remove: id => repo.hardRemove(id).pipe(
            Effect.withSpan("remove.refreshtoken.service"),
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
