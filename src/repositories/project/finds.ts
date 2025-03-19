import type { PrismaClient } from "@prisma/client"
import type { ProjectRepository } from "../../types/repositories/project.js"
import { Effect } from "effect"
import { Helpers, ProjectSchema, ProjectWithRelationsSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/project-errors.js"

export function findMany(prismaClient: PrismaClient): ProjectRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyProjectError.new(),
    try: () => prismaClient.projects.findMany({
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.SchemaArray)),
    Effect.withSpan("find-many.project.repository"),
  )
}

export function findManyWithRelations(prismaClient: PrismaClient): ProjectRepository["findManyWithRelations"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyProjectError.new(),
    try: () => prismaClient.projects.findMany({
      include: {
        projectRelation: {
          where: {
            deletedAt: null,
          },
        },
      },
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectWithRelationsSchema.SchemaArray)),
    Effect.withSpan("find-many-with-relation.project.repository"),
  )
}

export function findById(prismaClient: PrismaClient): ProjectRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.findProjectByIdError.new(),
    try: () => prismaClient.projects.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)),
    Effect.withSpan("find-by-id.project.repository"),
  )
}

export function findByIdWithRelation(prismaClient: PrismaClient): ProjectRepository["findByIdWithRelation"] {
  return id => Effect.tryPromise({
    catch: Errors.findProjectByIdError.new(),
    try: () => prismaClient.projects.findUnique({
      include: {
        projectRelation: {
          where: {
            deletedAt: null,
          },
        },
      },
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectWithRelationsSchema.Schema)),
    Effect.withSpan("find-many-with-relation.project.repository"),
  )
}
// export function findByIdWithRelation(prismaClient: PrismaClient): OrganizationRepository["findByIdWithRelation"] {
//   return id => Effect.tryPromise({
//     catch: Errors.findORGByIdError.new(),
//     try: () => prismaClient.organization.findUnique({
//       include: {
//         users: {
//           where: { deletedAt: null },
//         },
//       },
//       where: {
//         deletedAt: null,
//         id,
//       },
//     }),
//   }).pipe(
//     Effect.andThen(Effect.fromNullable),
//     Effect.andThen(Helpers.fromObjectToSchema(ORGWithRelarionSchema.Schema)),
//     Effect.withSpan("find-by-id.organization.repository"),
//   )
// }
