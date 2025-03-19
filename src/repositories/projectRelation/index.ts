import type { PrismaClient } from "@prisma/client"
import type * as Types from "../../types/repositories/projectRelation.js"
import { Context, Effect, Layer } from "effect"
import PrismaClientContext from "../prisma.js"
import * as Count from "./count.js"
import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
// import * as Removes from "./removes.js"
// import * as Updates from "./updates.js"

function initProjectRelationRepositoryContext(prismaClient: PrismaClient): Types.ProjectRelationRepository {
  return {
    count: Count.count(prismaClient),
    create: Creates.create(prismaClient),
    findById: Finds.findById(prismaClient),
    findMany: Finds.findMany(prismaClient),
    findManyPagination: Finds.findManyPagination(prismaClient),
  }
}

export class ProjectRelationRepositoryContext extends Context.Tag("repository/projectrelation")<ProjectRelationRepositoryContext, Types.ProjectRelationRepository>() {
  static Live = Layer.effect(this, Effect.gen(function* () {
    const prismaClient = yield * PrismaClientContext
    return initProjectRelationRepositoryContext(prismaClient)
  }))
}
