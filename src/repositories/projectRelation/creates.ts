import type { PrismaClient } from "@prisma/client"
import type { ProjectRelationRepository } from "../../types/repositories/projectRelation.js"
import { Effect } from "effect"
import { Helpers, ProjectRelationsWithRelationsSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/projectRelation-errors.js"

export function create(prismaClient: PrismaClient): ProjectRelationRepository["create"] {
  return data => Effect.tryPromise({
    catch: Errors.createProjectRelationtError.new(),
    try: () => prismaClient.projectRelation.create({
      data,
      include: {
        project: true,
      },
    }),
  }).pipe(
    // Effect.tap(b => console.log("repo", b)),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectRelationsWithRelationsSchema.Schema)),
    // Effect.tap(b => console.log("repo", b)),
    Effect.withSpan("create.projectRelation.repository"),
  )
}
