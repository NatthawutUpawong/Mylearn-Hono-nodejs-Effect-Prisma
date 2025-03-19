import type { PrismaClient } from "@prisma/client"
import type { ProjectRelationRepository } from "../../types/repositories/projectRelation.js"
import { Effect } from "effect"
import { Helpers, ProjectRelaionSchema, ProjectSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/projectRelation-errors.js"

export function findMany(prismaClient: PrismaClient): ProjectRelationRepository["findMany"] {
  return whereCondition => Effect.tryPromise({
    catch: Errors.findManyProjectRelationtError.new(),
    try: () => prismaClient.projectRelations.findMany({
      include: {
        project: {
          include: {
            projectRelation: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
      where: {
        ...whereCondition,
      },
    }),
  }).pipe(
    Effect.map(results => results.map(rel => rel.project)),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.SchemaArray)),
    Effect.withSpan("find-many.project.repository"),
  )
}

export function findById(prismaClient: PrismaClient): ProjectRelationRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.findProjectRelationtByIdError.new(),
    try: () => prismaClient.projectRelations.findUnique({
      where: {
        deletedAt: null,
        projectId: id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectRelaionSchema.Schema)),
    Effect.withSpan("find-by-id.projectReletion.repository"),
  )
}

export function findManyPagination(prismaClient: PrismaClient): ProjectRelationRepository["findManyPagination"] {
  return (limit: number, offset: number, whereCondition: any) => Effect.tryPromise({
    catch: Errors.findManyProjectRelationtError.new(),
    try: () => prismaClient.projectRelations.findMany({
      include: {
        project: {
          include: {
            projectRelation: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
      where: {
        ...whereCondition,
      },
    }),
  }).pipe(
    // Effect.andThen(b => b),
    Effect.map(results => results.map(rel => rel.project)),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.SchemaArray)),
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
