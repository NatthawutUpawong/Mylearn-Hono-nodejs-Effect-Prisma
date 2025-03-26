import { Context, Effect, Layer } from "effect";
import PrismaClientContext from "../prisma.js";
import * as Count from "./count.js";
import * as Creates from "./creates.js";
import * as Finds from "./finds.js";
// import * as Removes from "./removes.js"
import * as Updates from "./updates.js";
function initProjectRelationRepositoryContext(prismaClient) {
    return {
        count: Count.count(prismaClient),
        create: Creates.create(prismaClient),
        findById: Finds.findById(prismaClient),
        findMany: Finds.findMany(prismaClient),
        findManyPagination: Finds.findManyPagination(prismaClient),
        updatePartial: Updates.updatePartial(prismaClient),
    };
}
export class ProjectRelationRepositoryContext extends Context.Tag("repository/projectrelation")() {
    static Live = Layer.effect(this, Effect.gen(function* () {
        const prismaClient = yield* PrismaClientContext;
        return initProjectRelationRepositoryContext(prismaClient);
    }));
}
