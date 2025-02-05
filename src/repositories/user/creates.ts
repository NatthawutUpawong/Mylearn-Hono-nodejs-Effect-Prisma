import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "../../types/repositories/user.js"
import { Helpers, UserSchema } from "../../schema/index.js"

export function create(prismaClient: PrismaClient): UserRepository["create"] {
  return async (data) => {
    const result = await prismaClient.user.create({
      data,
    })
    return Helpers.fromObjectToSchema(UserSchema.Schema)(result)
  }
}
