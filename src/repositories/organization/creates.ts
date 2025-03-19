import type { PrismaClient } from "@prisma/client"
import type { OrganizationRepository } from "../../types/repositories/organization.js"
import { Effect } from "effect"
import { Helpers, OrganizationSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/ORG-errors.js"

export function create(prismaClient: PrismaClient): OrganizationRepository["create"] {
  return data => Effect.tryPromise({
    catch: Errors.createORGError.new(),
    try: () => prismaClient.organizations.create({
      data,
    }),

  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)),
    Effect.withSpan("create.organization.repositoty"),
  )
}
