import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "../../types/repositories/user.js"
import { Helpers, UserSchema } from "../../schema/index.js"

export function update(prismaClient: PrismaClient): UserRepository["update"] {
  return async (id, data) => {
    const result = await prismaClient.user.update({
      data,
      where: {
        deletedAt: null,
        id,
      },
    })

    return Helpers.fromObjectToSchema(UserSchema.Schema)(result)
  }
}

export function updatePartial(prismaClient: PrismaClient): UserRepository["updatePartial"] {
  return async (id, data) => {
    const result = await prismaClient.user.update({
      data,
      where: {
        deletedAt: null,
        id,
      },
    })

    return Helpers.fromObjectToSchema(UserSchema.Schema)(result)
  }
}