import type { PrismaClient } from "@prisma/client"
import type { RefreshTokenRepository } from "../../types/repositories/refreshtoken.js"
import { Effect } from "effect"
import { Helpers, RefreshTokenSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/refreshtoken-errors.js"

export function update(prismaClient: PrismaClient): RefreshTokenRepository["update"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.updateRefreshTokenError.new(),
    try: () => prismaClient.refreshtoken.update({
      data,
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("update.refreshtoken.repository"),
  )
}

export function updatePartial(prismaClient: PrismaClient): RefreshTokenRepository["updatePartial"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.updateRefreshTokenError.new(),
    try: () => prismaClient.refreshtoken.update({
      data,
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("updatePartial.refreshtoken.repository"),
  )
}
