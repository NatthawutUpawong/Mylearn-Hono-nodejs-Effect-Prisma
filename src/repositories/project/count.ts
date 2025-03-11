import type { PrismaClient } from "@prisma/client"
import type { ProjectRepository } from "../../types/repositories/project.js"
import { Effect } from "effect"
import * as Errors from "../../types/error/project-errors.js"

export function count(prismaClient: PrismaClient): ProjectRepository["count"] {
  return (whereCondition) => Effect.tryPromise({
    catch: Errors.findManyProjectError.new(),
    try: () => prismaClient.projectRelation.count({
      where: {
        ...whereCondition,
      },
    }),

  }).pipe(
    Effect.tap(b => console.log(b)),
    Effect.withSpan("count.project.repositoty"),
  )
}
