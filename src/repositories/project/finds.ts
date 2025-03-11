import type { PrismaClient } from "@prisma/client"
import type { ProjectRepository } from "../../types/repositories/project.js"
import { Effect } from "effect"
import { Helpers, ProjectSchema, ProjectWithRelationsSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/project-errors.js"

export function findMany(prismaClient: PrismaClient): ProjectRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyProjectError.new(),
    try: () => prismaClient.project.findMany({
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
    try: () => prismaClient.project.findMany({
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

// export function findManyPagination(prismaClient: PrismaClient): ProjectRepository["findManyPagination"] {
//   return (limit: number, offset: number, whereCondition: any) => Effect.tryPromise({
//     catch: Errors.findManyProjectError.new(),
//     try: () => prismaClient.projectRelation.findMany({
//       include: {
//         project: {
//           include: {
//             projectRelation: {
//               where: {
//                 deletedAt: null,
//               },
//             },
//           },
//         },
//       },
//       skip: offset,
//       take: limit,
//       where: {
//         ...whereCondition,
//       },
//     }),
//   }).pipe(
//     // Effect.andThen(b => b),
//     Effect.map(results => results.map(rel => rel.project)),
//     Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.SchemaArray)),
//     Effect.withSpan("find-many-with-relation.project.repository"),
//   )
// }

export function findById(prismaClient: PrismaClient): ProjectRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.findProjectByIdError.new(),
    try: () => prismaClient.project.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)),
    Effect.withSpan("find-by-id.organization.repository"),
  )
}

export function findByIdWithRelation(prismaClient: PrismaClient): ProjectRepository["findByIdWithRelation"] {
  return id => Effect.tryPromise({
    catch: Errors.findProjectByIdError.new(),
    try: () => prismaClient.project.findUnique({
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
    // Effect.tap(b => console.log("from repo", JSON.stringify(b, null, 2))),
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
