import type { Effect } from "effect"
import type { paginationSchema, ProjectSchema } from "../../schema/index.js"
import type * as Errors from "../error/projectRelation-errors.js"
import type { ProjectRelationRepository } from "../repositories/projectRelation.js"

export type ProjectRelationService = {
  create: ProjectRelationRepository["create"]
  findById: ProjectRelationRepository["findById"]
  findMany: ProjectRelationRepository["findMany"]
  findManyPagination: (limit: number, offset: number, page: number, whereCondition: any) => Effect.Effect<{
      data: ProjectSchema.ProjectArray
      pagination: paginationSchema.pagination
  }, Errors.findManyProjectRelationtError>
  // findManyWithRelation: ProjectRelationRepository["findManyWithRelation"]
  update: ProjectRelationRepository["updatePartial"]
  // remove: ProjectRelationRepository["remove"]
}
