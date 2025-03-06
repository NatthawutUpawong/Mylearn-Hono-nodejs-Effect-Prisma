import type { Effect } from "effect"
import type { ParseError } from "effect/ParseResult"
import type { ProjectRelaionSchema, ProjectRelationsWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/projectRelation-errors.js"
import type { ProjectRelationRepository } from "../repositories/projectRelation.js"

export type ProjectRelationService = {
  // create: (data: ProjectRelaronSchema.CreateProjectRelationEncoded) => Effect.Effect<ProjectRelationsWithRelationsSchema.ProjectWithRelations, Errors.createProjectRelationtError | ParseError>
  create: ProjectRelationRepository["create"]
  // findById: ProjectRelationRepository["findById"]
  findMany: ProjectRelationRepository["findMany"]
  // update: ProjectRelationRepository["update"]
  // remove: ProjectRelationRepository["remove"]
}
