import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "../../types/repositories/user.js"
import { Effect } from "effect"
import { Helpers, UserSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/user-errors.js"

export function remove(prismaClient: PrismaClient): UserRepository["remove"] {
  return id => Effect.tryPromise({
    catch: Errors.RemoveUserError.new(),
    try: () => prismaClient.user.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      }
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
    Effect.withSpan("remove.user.repository")
  )
}

export function hardRemoveById(prismaClient: PrismaClient): UserRepository["hardRemove"] {
  return id => Effect.tryPromise({
    catch: Errors.RemoveUserError.new(),
    try: () => prismaClient.user.delete({
      where: {
        id,
      }
    })
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
    Effect.withSpan("hard-remove.user.repostory")
  )
}
