import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "../../types/repositories/user.js"
import { Effect } from "effect"
import * as Errors from "../../types/error/user-errors.js"

export function count(prismaClient: PrismaClient): UserRepository["count"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyUserError.new(),
    try: () => prismaClient.users.count({
      where: {
        deletedAt: null,
      },
    }),

  }).pipe(
    Effect.withSpan("count.User.repositoty"),
  )
}
