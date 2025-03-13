import type { PrismaClient } from "@prisma/client"
import type * as Types from "../../types/repositories/refreshtoken.js"
import { Context, Effect, Layer } from "effect"
import PrismaClientContext from "../prisma.js"
import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"

function initRefreshTokenRepositoryContext(prismaClient: PrismaClient): Types.RefreshTokenRepository {
  return {
    create: Creates.create(prismaClient),
    findByUserId: Finds.findByUserId(prismaClient),
    hardRemove: Removes.hardRemoveById(prismaClient),
    remove: Removes.remove(prismaClient),
    update: Updates.update(prismaClient),
    updatePartial: Updates.updatePartial(prismaClient),
  }
}

export class RefreshTokenRepositoryContext extends Context.Tag("repository/refreshtoken")<RefreshTokenRepositoryContext, Types.RefreshTokenRepository>() {
  static Live = Layer.effect(this, Effect.gen(function* () {
    const prismaClient = yield * PrismaClientContext
    return initRefreshTokenRepositoryContext(prismaClient)
  }))
}
