import { Layer, ManagedRuntime } from "effect";
import PrismaClientContext from "../repositories/prisma.js";
import { UserRepositoryContext } from "../repositories/user/index.js";
import { JwtServiceContext } from "../services/jwt/indext.js";
import { PasswordServiceContext } from "../services/password/indext.js";
import { UserServiceContext } from "../services/user/index.js";

const PrismaClientLive = PrismaClientContext.Live
const UserServiceLive = UserServiceContext.Live.pipe(
    Layer.provide(UserRepositoryContext.Live),
    Layer.provide(PrismaClientLive)
)
// const PasswordServiceLive = PasswordServiceContext.Live.pipe(
//     Layer.provide(PasswordServiceContext.Live),
// )
export const ServiceLive = Layer.mergeAll(
    UserServiceLive,
    PasswordServiceContext.Default,
    JwtServiceContext.Default,
)

export const ServicesRuntime = ManagedRuntime.make(ServiceLive)