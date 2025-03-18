import type { PrismaClient } from "@prisma/client"
import type { ProjectRelationRepository } from "../../types/repositories/projectRelation.js"
import { Effect } from "effect"
import * as Errors from "../../types/error/projectRelation-errors.js"

export function count(prismaClient: PrismaClient): ProjectRelationRepository["count"] {
  return (whereCondition) => Effect.tryPromise({
    catch: Errors.findManyProjectRelationtError.new(),
    try: () => prismaClient.projectRelation.count({
      where: {
        ...whereCondition,
      },
    }),

  }).pipe(
    Effect.withSpan("count.project.repositoty"),
  )
}
