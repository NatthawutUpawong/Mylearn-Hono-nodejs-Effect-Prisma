// import type { PrismaClient } from "@prisma/client"
// import type { OrganizationRepository } from "../../types/repositories/organization.js"
// import { Effect } from "effect"
// import { Helpers, OrganizationSchema } from "../../schema/index.js"
// import * as Errors from "../../types/error/ORG-errors.js"

// export function update(prismaClient: PrismaClient): OrganizationRepository["update"] {
//   return (id, data) => Effect.tryPromise({
//     catch: Errors.updateORGError.new(),
//     try: () => prismaClient.organization.update({
//       data,
//       where: {
//         deletedAt: null,
//         id
//       }
//     }),
//   }).pipe(
//     Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)),
//     Effect.withSpan("update.user.repository")
//   )
// }

// export function updatePartial(prismaClient: PrismaClient): OrganizationRepository["updatePartial"] {
//   return (id, data) => Effect.tryPromise({
//     catch: Errors.updateORGError.new(),
//     try: () => prismaClient.organization.update({
//       data,
//       where: {
//         deletedAt: null,
//         id
//       }
//     }),
//   }).pipe(
//     Effect.andThen(Helpers.fromObjectToSchema(OrganizationSchema.Schema)),
//     Effect.withSpan("updatePartial.user.repository")
//   )
// }