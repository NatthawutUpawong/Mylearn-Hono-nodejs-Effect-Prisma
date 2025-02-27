import type { OrganizationRepository } from "../repositories/organization.js"

export type OrganizationService = {
  create: OrganizationRepository["create"]
  findById: OrganizationRepository["findByIdWithRelation"]
  findMany: OrganizationRepository["findManyWithRelation"]
  update: OrganizationRepository["update"]
  remove: OrganizationRepository["remove"]
}
