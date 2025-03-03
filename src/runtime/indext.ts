/* eslint-disable perfectionist/sort-imports */
import { Layer, ManagedRuntime } from "effect"
import PrismaClientContext from "../repositories/prisma.js"
import { UserRepositoryContext } from "../repositories/user/index.js"
import { JwtServiceContext } from "../services/jwt/indext.js"
import { PasswordServiceContext } from "../services/password/indext.js"
import { UserServiceContext } from "../services/user/index.js"
import { OrganizationServiceContext } from "../services/organization/index.js"
import { OrganizationRepositoryContext } from "../repositories/organization/index.js"
import { ProjectServiceContext } from "../services/project/index.js"
import { ProjectRelationServiceContext } from "../services/projectRelation/index.js"
import { ProjectRepositoryContext } from "../repositories/project/index.js"
import { ProjectRelationRepositoryContext } from "../repositories/projectRelation/index.js"

const PrismaClientLive = PrismaClientContext.Live

const UserServiceLive = UserServiceContext.Live.pipe(
  Layer.provide(UserRepositoryContext.Live),
  Layer.provide(PrismaClientLive),
)

const OrganizationServiceLive = OrganizationServiceContext.Live.pipe(
  Layer.provide(OrganizationRepositoryContext.Live),
  Layer.provide(PrismaClientLive),
)

const ProjectServiceLive = ProjectServiceContext.Live.pipe(
  Layer.provide(ProjectRepositoryContext.Live),
  Layer.provide(PrismaClientLive),
)

const ProjectRelationServiceLive = ProjectRelationServiceContext.Live.pipe(
  Layer.provide(ProjectRelationRepositoryContext.Live),
  Layer.provide(PrismaClientLive),
)
// const PasswordServiceLive = PasswordServiceContext.Live.pipe(
//     Layer.provide(PasswordServiceContext.Live),
// )
export const ServiceLive = Layer.mergeAll(
  UserServiceLive,
  OrganizationServiceLive,
  ProjectServiceLive,
  ProjectRelationServiceLive,
  PasswordServiceContext.Default,
  JwtServiceContext.Default,
)

export const ServicesRuntime = ManagedRuntime.make(ServiceLive)
