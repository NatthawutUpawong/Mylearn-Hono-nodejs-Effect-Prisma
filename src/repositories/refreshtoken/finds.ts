import type { PrismaClient } from "@prisma/client"
import type { RefreshTokenRepository } from "../../types/repositories/refreshtoken.js"
import { Effect } from "effect"
import { Helpers, RefreshTokenSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/refreshtoken-errors.js"

export function findByUserId(prismaClient: PrismaClient): RefreshTokenRepository["findByUserId"] {
  return userId => Effect.tryPromise({
    catch: Errors.findRefreshTokenUserByIdError.new(),
    try: () => prismaClient.refreshtoken.findUnique({
      where: {
        deletedAt: null,
        userId,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("find-by-id.organization.repository"),
  )
}
export function findByToken(prismaClient: PrismaClient): RefreshTokenRepository["findByToken"] {
  return token => Effect.tryPromise({
    catch: Errors.findRefreshTokenUserByTokenError.new(),
    try: () => prismaClient.refreshtoken.findUnique({
      where: {
        deletedAt: null,
        token,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("find-by-id.organization.repository"),
  )
}
