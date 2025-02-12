import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "../../types/repositories/user.js"
import { Effect } from "effect"
import { Helpers, UserSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/user-errors.js"

export function update(prismaClient: PrismaClient): UserRepository["update"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.UpdateUserErro.new(),
    try: () => prismaClient.user.update({
      data,
      where: {
        deletedAt: null,
        id
      }
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
    Effect.withSpan("update.user.repository")
  )
}

export function updatePartial(prismaClient: PrismaClient): UserRepository["updatePartial"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.UpdateUserErro.new(),
    try: () => prismaClient.user.update({
      data,
      where: {
        deletedAt: null,
        id
      }
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
    Effect.withSpan("updatePartial.user.repository")
  )
}