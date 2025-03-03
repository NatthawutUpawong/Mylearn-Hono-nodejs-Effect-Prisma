import type { PrismaClient } from "@prisma/client"
import type * as Types from "../../types/repositories/project.js"
import { Context, Effect, Layer } from "effect"
import PrismaClientContext from "../prisma.js"
import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"

function initProjectRepositoryContext(prismaClient: PrismaClient): Types.ProjectRepository {
  return {
    create: Creates.create(prismaClient),
    findById: Finds.findById(prismaClient),
    findByIdWithRelation: Finds.findByIdWithRelation(prismaClient),
    findMany: Finds.findMany(prismaClient),
    findManyWithRelations: Finds.findManyWithRelations(prismaClient),
    hardRemove: Removes.hardRemoveById(prismaClient),
    remove: Removes.remove(prismaClient),
    update: Updates.update(prismaClient),
    updatePartial: Updates.updatePartial(prismaClient),
  }
}

export class ProjectRepositoryContext extends Context.Tag("repository/project")<ProjectRepositoryContext, Types.ProjectRepository>() {
  // method Live ที่จะใช้สร้าง Context EmployeeRepositoryContext จะสร้างผ่าน Layer.effect(<class name>, <Effect value>) รับ parameters 2 ตัว
  static Live = Layer.effect(this, Effect.gen(function* () {
    const prismaClient = yield * PrismaClientContext
    return initProjectRepositoryContext(prismaClient)
  }))
}
