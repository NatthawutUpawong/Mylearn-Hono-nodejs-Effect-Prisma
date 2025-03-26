import { Context, Effect, Layer } from "effect";
import PrismaClientContext from "../prisma.js";
import * as Count from "./count.js";
import * as Creates from "./creates.js";
import * as Finds from "./finds.js";
import * as Removes from "./removes.js";
import * as Updates from "./updates.js";
function initRefreshTokenRepositoryContext(prismaClient) {
    return {
        count: Count.count(prismaClient),
        create: Creates.create(prismaClient),
        findByToken: Finds.findByToken(prismaClient),
        findByUserId: Finds.findByUserId(prismaClient),
        findManyPagination: Finds.findManyPagination(prismaClient),
        finManyWithRelation: Finds.finManyWithRelation(prismaClient),
        hardRemoveById: Removes.hardRemoveById(prismaClient),
        hardRemoveByUserId: Removes.hardRemoveByUserId(prismaClient),
        remove: Removes.remove(prismaClient),
        update: Updates.update(prismaClient),
        updatePartial: Updates.updatePartial(prismaClient),
    };
}
export class RefreshTokenRepositoryContext extends Context.Tag("repository/refreshtoken")() {
    static Live = Layer.effect(this, Effect.gen(function* () {
        const prismaClient = yield* PrismaClientContext;
        return initRefreshTokenRepositoryContext(prismaClient);
    }));
}
