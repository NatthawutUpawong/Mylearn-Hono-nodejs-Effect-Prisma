import type { PrismaClient } from "@prisma/client"
import type { ProjectRepository } from "../../types/repositories/project.js"
import { Effect } from "effect"
import { Helpers, ProjectSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/project-errors.js"

export function update(prismaClient: PrismaClient): ProjectRepository["update"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.updateProjectError.new(),
    try: () => prismaClient.project.update({
      data,
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)),
    Effect.withSpan("update.project.repository"),
  )
}

export function updatePartial(prismaClient: PrismaClient): ProjectRepository["updatePartial"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.updateProjectError.new(),
    try: () => prismaClient.project.update({
      data,
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)),
    Effect.withSpan("updatePartial.project.repository"),
  )
}
