import type { PrismaClient } from "@prisma/client"
import type * as Types from "../../types/repositories/user.js"
import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
import { Context, Effect, Layer } from "effect"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"
import PrismaClientContext from "../prisma.js"

function initUserRepository(prismaClient: PrismaClient): Types.UserRepository {
  return {
    create: Creates.create(prismaClient),
    findById: Finds.findById(prismaClient,),
    findByUsername: Finds.findByusername(prismaClient),
    findMany: Finds.findMany(prismaClient),
    hardRemove: Removes.hardRemoveById(prismaClient),
    remove: Removes.remove(prismaClient),
    update: Updates.update(prismaClient),
    updatePartial: Updates.updatePartial(prismaClient),
    findallById: Finds.findallById(prismaClient)
  }
}

export class UserRepositoryContext extends Context.Tag("repository/User")<UserRepositoryContext, Types.UserRepository>() {
  // method Live ที่จะใช้สร้าง Context EmployeeRepositoryContext จะสร้างผ่าน Layer.effect(<class name>, <Effect value>) รับ parameters 2 ตัว
  static Live = Layer.effect(this, Effect.gen(function* () {
    const prismaClient = yield * PrismaClientContext
    return initUserRepository(prismaClient)
  }))
}