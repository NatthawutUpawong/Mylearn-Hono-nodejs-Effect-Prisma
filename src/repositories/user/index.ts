import type { PrismaClient } from "@prisma/client"
import type * as Types from "../../types/repositories/user.js"
import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"

export default function initUserRepository(prismaClient: PrismaClient): Types.UserRepository {
  return {
    create: Creates.create(prismaClient),
    findById: Finds.findById(prismaClient),
    findByUsername: Finds.findByusername(prismaClient),
    findMany: Finds.findMany(prismaClient),
    hardRemove: Removes.hardRemoveById(prismaClient),
    remove: Removes.remove(prismaClient),
    update: Updates.update(prismaClient),
    updatePartial: Updates.updatePartial(prismaClient),
  }
}
