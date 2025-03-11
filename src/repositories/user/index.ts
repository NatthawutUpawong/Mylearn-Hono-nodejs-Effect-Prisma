import type { PrismaClient } from "@prisma/client"
import type * as Types from "../../types/repositories/user.js"
import { Context, Effect, Layer } from "effect"
import PrismaClientContext from "../prisma.js"
import * as Count from "./count.js"
import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"

function initUserRepository(prismaClient: PrismaClient): Types.UserRepository {
  return {
    count: Count.count(prismaClient),
    create: Creates.create(prismaClient),
    findallById: Finds.findallById(prismaClient),
    findById: Finds.findById(prismaClient),
    findByUsername: Finds.findByusername(prismaClient),
    findMany: Finds.findMany(prismaClient),
    findManyPagination: Finds.findManyPagination(prismaClient),
    hardRemove: Removes.hardRemoveById(prismaClient),
    remove: Removes.remove(prismaClient),
    update: Updates.update(prismaClient),
    updatePartial: Updates.updatePartial(prismaClient),
  }
}

export class UserRepositoryContext extends Context.Tag("repository/User")<UserRepositoryContext, Types.UserRepository>() {
  // method Live ที่จะใช้สร้าง Context EmployeeRepositoryContext จะสร้างผ่าน Layer.effect(<class name>, <Effect value>) รับ parameters 2 ตัว
  static Live = Layer.effect(this, Effect.gen(function* () {
    const prismaClient = yield * PrismaClientContext
    return initUserRepository(prismaClient)
  }))
}
