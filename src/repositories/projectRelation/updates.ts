import type { PrismaClient } from "@prisma/client"
import type { ProjectRelationRepository } from "../../types/repositories/projectRelation.js"
import { Effect } from "effect"
import { Helpers, ProjectRelaionSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/projectRelation-errors.js"

export function updatePartial(prismaClient: PrismaClient): ProjectRelationRepository["updatePartial"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.updateProjectRelationtError.new(),
    try: () => prismaClient.projectRelations.updateManyAndReturn({
      data,
      where: {
        deletedAt: null,
        userId: id,
      },
    }),

  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectRelaionSchema.SchemaArray)),
    Effect.withSpan("update-partial.project-relation.repository"),
  )
}
