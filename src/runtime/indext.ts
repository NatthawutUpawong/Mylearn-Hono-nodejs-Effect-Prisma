import { Layer, ManagedRuntime } from "effect";
import { UserRepositoryContext } from "../repositories/user/index.js";
import PrismaClientContext from "../repositories/prisma.js";
import { UserServiceContext } from "../services/user/index.js";
import { PasswordServiceContext } from "../services/password/hashpassword.js";

const PrismaClientLive = PrismaClientContext.Live
const UserServiceLive = UserServiceContext.Live.pipe(
    Layer.provide(UserRepositoryContext.Live),
    Layer.provide(PrismaClientLive)
)
const PasswordServiceLive = PasswordServiceContext.Live.pipe(
    Layer.provide(PasswordServiceContext.Live),
)
export const ServiceLive = Layer.mergeAll(
    UserServiceLive,
    PasswordServiceLive,
)

export const ServicesRuntime = ManagedRuntime.make(ServiceLive)