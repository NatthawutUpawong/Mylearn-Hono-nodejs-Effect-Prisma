import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "../../types/repositories/user.js"
import { Helpers, UserSchema } from "../../schema/index.js"

export function remove(prismaClient: PrismaClient): UserRepository["remove"] {
  return async (id) => {
    const result = await prismaClient.user.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    })

    return Helpers.fromObjectToSchema(UserSchema.Schema)(result)
  }
}

export function hardRemoveById(prismaClient: PrismaClient): UserRepository["hardRemove"] {
  return async (id) => {
    const result = await prismaClient.user.delete({
      where: {
        id,
      },
    })
    return Helpers.fromObjectToSchema(UserSchema.Schema)(result)
  }
}
