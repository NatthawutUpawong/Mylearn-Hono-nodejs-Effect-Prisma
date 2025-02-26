import type { OrganizationRepository } from "../repositories/organization.js"

export type OrganizationService = {
  create: OrganizationRepository["create"]
  findById: OrganizationRepository["findById"]
  findMany: OrganizationRepository["findMany"]
  update: OrganizationRepository["update"]
  remove: OrganizationRepository["remove"]
}
