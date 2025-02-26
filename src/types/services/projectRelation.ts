import type { ProjectRelarionRepository } from "../repositories/projectRelation.js"

export type ProjectRelationService = {
  create: ProjectRelarionRepository["create"]
  findById: ProjectRelarionRepository["findById"]
  findMany: ProjectRelarionRepository["findMany"]
  update: ProjectRelarionRepository["update"]
  remove: ProjectRelarionRepository["remove"]
}
