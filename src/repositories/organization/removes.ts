import type { PrismaClient } from "@prisma/client"
import type { OrganizationRepository } from "../../types/repositories/organization.js"
import { Effect } from "effect"
import { Helpers, OrganizationSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/ORG-errors.js"

export function remove(prismaClient: PrismaClient): OrganizationRepository["remove"] {
  return id => Effect.tryPromise({
    catch: Errors.removeORGError.new(),
    try: () => prismaClient.organizations.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)),
    Effect.withSpan("remove.organization.repository"),
  )
}

export function hardRemoveById(prismaClient: PrismaClient): OrganizationRepository["hardRemove"] {
  return id => Effect.tryPromise({
    catch: Errors.removeORGError.new(),
    try: () => prismaClient.organizations.delete({
      where: {
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)),
    Effect.withSpan("hard-remove.organizationRepository.repostory"),
  )
}
