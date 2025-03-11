import type { PrismaClient } from "@prisma/client"
import type { OrganizationRepository } from "../../types/repositories/organization.js"
import { Effect } from "effect"
import * as Errors from "../../types/error/ORG-errors.js"

export function count(prismaClient: PrismaClient): OrganizationRepository["count"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyORGError.new(),
    try: () => prismaClient.organization.count({
      where: {
        deletedAt: null,
      },
    }),

  }).pipe(
    Effect.withSpan("count.organization.repositoty"),
  )
}
