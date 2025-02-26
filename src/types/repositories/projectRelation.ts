import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, ProjectRelarionSchema } from "../../schema/index.js"
import type * as Errors from "../error/projectRelation-errors.js"

type ProjectRelarion = ProjectRelarionSchema.ProjectRelation

export type ProjectRelarionRepository = {
  create: (data: ProjectRelarionSchema.CreateProjectRelationEncoded) => Effect.Effect<ProjectRelarion, Errors.createProjectRelationtError | ParseError>
  findById: (id: Branded.ProjectRelarionId) => Effect.Effect<ProjectRelarion, Errors.findProjectRelationtByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<ProjectRelarion, Errors.findManyProjectRelationtError>
  update: (id: Branded.ProjectRelarionId, data: ProjectRelarionSchema.UpdateProjectRelationEncoded) => Effect.Effect<ProjectRelarion, Errors.updateProjectRelationtError | ParseError>
  updatePartial: (id: Branded.OrganizationId, data: Partial<ProjectRelarionSchema.UpdateProjectRelationEncoded>) => Effect.Effect<ProjectRelarion, Errors.updateProjectRelationtError>
  remove: (id: Branded.ProjectRelarionId) => Effect.Effect<ProjectRelarion, Errors.removeProjectRelationtError>
  hardRemove: (id: Branded.ProjectRelarionId) => Effect.Effect<ProjectRelarion, Errors.removeProjectRelationtError>
}
