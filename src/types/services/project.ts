import type { ProjectRepository } from "../repositories/project.js"

export type ProjectService = {
  create: ProjectRepository["create"]
  findById: ProjectRepository["findByIdWithRelation"]
  // findMany: ProjectRepository["findManyWithRelations"]
  findMany: ProjectRepository["findMany"]
  update: ProjectRepository["update"]
  remove: ProjectRepository["hardRemove"]
}
