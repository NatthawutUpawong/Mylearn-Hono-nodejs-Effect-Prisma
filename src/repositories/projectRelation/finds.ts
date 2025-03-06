import type { PrismaClient } from "@prisma/client"
import type { ProjectRelationRepository } from "../../types/repositories/projectRelation.js"
import { Effect } from "effect"
import { Helpers, ProjectRelationsWithRelationsSchema} from "../../schema/index.js"
import * as Errors from "../../types/error/projectRelation-errors.js"

export function findMany(prismaClient: PrismaClient): ProjectRelationRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyProjectRelationtError.new(),
    try: () => prismaClient.projectRelation.findMany({
        include: {
            project: true
        },
        where: {
            deletedAt: null,
          },
    }),
  }).pipe(
    // Effect.tap(b => console.log(b)),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectRelationsWithRelationsSchema.SchemaArray)),
    Effect.withSpan("find-many.organization.repository"),
  )
}

// export function findManyWithRelation(prismaClient: PrismaClient): OrganizationRepository["findManyWithRelation"] {
//   return () => Effect.tryPromise({
//     catch: Errors.findManyORGError.new(),
//     try: () => prismaClient.organization.findMany({
//       include: {
//         users: {
//           where: { deletedAt: null },
//         },
//       },
//       where: {
//         deletedAt: null,
//       },
//     }),
//   }).pipe(
//     // Effect.tap(b => console.log(b)),
//     Effect.andThen(Helpers.fromObjectToSchema(ORGWithRelarionSchema.SchemaArray)),
//     Effect.withSpan("find-many.organization.repository"),
//   )
// }

// export function findById(prismaClient: PrismaClient): OrganizationRepository["findById"] {
//   return id => Effect.tryPromise({
//     catch: Errors.findORGByIdError.new(),
//     try: () => prismaClient.organization.findUnique({
//       where: {
//         deletedAt: null,
//         id,
//       },
//     }),
//   }).pipe(
//     Effect.andThen(Effect.fromNullable),
//     Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)),
//     Effect.withSpan("find-by-id.organization.repository"),
//   )
// }

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
