import type { PrismaClient } from "@prisma/client"
import type { ProjectRepository } from "../../types/repositories/project.js"
import { Effect } from "effect"
import { Helpers, ProjectSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/project-errors.js"

export function remove(prismaClient: PrismaClient): ProjectRepository["remove"] {
  return id => Effect.tryPromise({
    catch: Errors.removeProjectError.new(),
    try: () => prismaClient.project.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)),
    Effect.withSpan("remove.project.repository"),
  )
}

export function hardRemoveById(prismaClient: PrismaClient): ProjectRepository["hardRemove"] {
  return id => Effect.tryPromise({
    catch: Errors.removeProjectError.new(),
    try: () => prismaClient.project.delete({
      where: {
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)),
    Effect.withSpan("hard-remove.project.repostory"),
  )
}
