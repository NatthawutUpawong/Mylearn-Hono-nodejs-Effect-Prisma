import type { Effect } from "effect"
import type { ORGWithRelarionSchema, paginationSchema } from "../../schema/index.js"
import type * as Errors from "../error/ORG-errors.js"
import type { OrganizationRepository } from "../repositories/organization.js"

export type OrganizationService = {
  create: OrganizationRepository["create"]
  findById: OrganizationRepository["findByIdWithRelation"]
  findMany: OrganizationRepository["findManyWithRelation"]
  findManyPagination: (limit: number, offset: number, page: number) => Effect.Effect<{
    data: ORGWithRelarionSchema.ORGWithRelationsArray
    pagination: paginationSchema.pagination
  }, Errors.findManyORGError>
  update: OrganizationRepository["update"]
  remove: OrganizationRepository["remove"]
}
