import type { ProjectRepository } from "../repositories/project.js"

export type ProjectService = {
  create: ProjectRepository["create"]
  findById: ProjectRepository["findByIdWithRelations"]
  findMany: ProjectRepository["findManyWithRelations"]
  update: ProjectRepository["update"]
  remove: ProjectRepository["remove"]
}
