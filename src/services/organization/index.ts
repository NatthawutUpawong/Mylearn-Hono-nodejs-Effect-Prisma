/* eslint-disable perfectionist/sort-objects */
import type { OrganizationService } from "../../types/services/organization.js"
import { Context, Effect, Layer } from "effect"
import { OrganizationRepositoryContext } from "../../repositories/organization/index.js"

export class OrganizationServiceContext extends Context.Tag("service/Organization")<OrganizationServiceContext, OrganizationService>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      repo: OrganizationRepositoryContext,
    }).pipe(
      Effect.andThen(({ repo }) => {
        return {
          create: data => repo.create(data).pipe(
            Effect.withSpan("create.Organization.service"),
          ),
          findById: id => repo.findByIdWithRelation(id).pipe(
            Effect.withSpan("fin-by-Id.Organization.service"),
          ),
          findMany: () => repo.findManyWithRelation().pipe(
            Effect.withSpan("findmany.Organization.service"),
          ),
          update: (id, data) => repo.update(id, data).pipe(
            Effect.withSpan("update.Organization.service"),
          ),
          remove: id => repo.hardRemove(id).pipe(
            Effect.withSpan("remove.Organization.service"),
          ),
        } satisfies OrganizationService
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
