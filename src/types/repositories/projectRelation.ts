import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, ProjectRelaionSchema, ProjectRelationsWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/projectRelation-errors.js"

type ProjectRelation = ProjectRelaionSchema.ProjectRelation

export type ProjectRelationRepository = {
  create: (data: ProjectRelaionSchema.CreateProjectRelationEncoded) => Effect.Effect<ProjectRelationsWithRelationsSchema.ProjectWithRelations, Errors.createProjectRelationtError | ParseError>
  // findById: (id: Branded.ProjectRelationId) => Effect.Effect<ProjectRelation, Errors.findProjectRelationtByIdError | ParseError | NoSuchElementException>
  // findMany: () => Effect.Effect<ProjectRelation, Errors.findManyProjectRelationtError>
  // update: (id: Branded.ProjectRelationId, data: ProjectRelaionSchema.UpdateProjectRelationEncoded) => Effect.Effect<ProjectRelation, Errors.updateProjectRelationtError | ParseError>
  // updatePartial: (id: Branded.OrganizationId, data: Partial<ProjectRelaionSchema.UpdateProjectRelationEncoded>) => Effect.Effect<ProjectRelation, Errors.updateProjectRelationtError>
  // remove: (id: Branded.ProjectRelationId) => Effect.Effect<ProjectRelation, Errors.removeProjectRelationtError>
  // hardRemove: (id: Branded.ProjectRelationId) => Effect.Effect<ProjectRelation, Errors.removeProjectRelationtError>
}
