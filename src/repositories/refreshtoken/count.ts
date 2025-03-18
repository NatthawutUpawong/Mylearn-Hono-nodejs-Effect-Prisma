import type { PrismaClient } from "@prisma/client"
import type { RefreshTokenRepository } from "../../types/repositories/refreshtoken.js"
import { Effect } from "effect"
import * as Errors from "../../types/error/refreshtoken-errors.js"

export function count(prismaClient: PrismaClient): RefreshTokenRepository["count"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyRefreshTokenError.new(),
    try: () => prismaClient.refreshtoken.count({
      where: {
        deletedAt: null,
      },
    }),

  }).pipe(
    Effect.withSpan("count.refreshtoken.repositoty"),
  )
}
