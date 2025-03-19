import type { PrismaClient } from "@prisma/client"
import type { OrganizationRepository } from "../../types/repositories/organization.js"
import { Effect } from "effect"
import { Helpers, OrganizationSchema, ORGWithRelarionSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/ORG-errors.js"

export function findMany(prismaClient: PrismaClient): OrganizationRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyORGError.new(),
    try: () => prismaClient.organizations.findMany({
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.SchemaArray)),
    Effect.withSpan("find-many.organization.repository"),
  )
}

export function findManyWithRelation(prismaClient: PrismaClient): OrganizationRepository["findManyWithRelation"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyORGError.new(),
    try: () => prismaClient.organizations.findMany({
      include: {
        users: {
          where: { deletedAt: null },
        },
      },
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ORGWithRelarionSchema.SchemaArray)),
    Effect.withSpan("find-many.organization.repository"),
  )
}
export function findManyPagination(prismaClient: PrismaClient): OrganizationRepository["findManyPagination"] {
  return (limit: number, offset: number) => Effect.tryPromise({
    catch: Errors.findManyORGError.new(),
    try: () => prismaClient.organizations.findMany({
      include: {
        users: {
          where: { deletedAt: null },
        },
      },
      skip: offset,
      take: limit,
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.SchemaArray)),
    Effect.withSpan("find-many.organization.repository"),
  )
}

export function findById(prismaClient: PrismaClient): OrganizationRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.findORGByIdError.new(),
    try: () => prismaClient.organizations.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)),
    Effect.withSpan("find-by-id.organization.repository"),
  )
}

export function findByIdWithRelation(prismaClient: PrismaClient): OrganizationRepository["findByIdWithRelation"] {
  return id => Effect.tryPromise({
    catch: Errors.findORGByIdError.new(),
    try: () => prismaClient.organizations.findUnique({
      include: {
        users: {
          where: { deletedAt: null },
        },
      },
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(ORGWithRelarionSchema.Schema)),
    Effect.withSpan("find-by-id.organization.repository"),
  )
}
