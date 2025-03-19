import type { PrismaClient } from "@prisma/client"
import type { RefreshTokenRepository } from "../../types/repositories/refreshtoken.js"
import { Effect } from "effect"
import { Helpers, RefreshTokenSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/refreshtoken-errors.js"

export function remove(prismaClient: PrismaClient): RefreshTokenRepository["remove"] {
  return id => Effect.tryPromise({
    catch: Errors.removeRefreshTokenError.new(),
    try: () => prismaClient.refreshtokens.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("remove.refreshtoken.repository"),
  )
}

export function hardRemoveById(prismaClient: PrismaClient): RefreshTokenRepository["hardRemoveById"] {
  return id => Effect.tryPromise({
    catch: Errors.removeRefreshTokenError.new(),
    try: () => prismaClient.refreshtokens.delete({
      where: {
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("hard-remove-by-id.refreshtoken.repostory"),
  )
}

export function hardRemoveByUserId(prismaClient: PrismaClient): RefreshTokenRepository["hardRemoveByUserId"] {
  return userId => Effect.tryPromise({
    catch: Errors.removeRefreshTokenError.new(),
    try: () => prismaClient.refreshtokens.delete({
      where: {
        userId,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("hard-remove-by-userId.refreshtoken.repostory"),
  )
}
