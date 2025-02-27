import type { Effect } from "effect"

import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, ProjectSchema, ProjectWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/project-errors.js"

type Project = ProjectSchema.Project

export type ProjectRepository = {
  create: (data: ProjectSchema.CreateProjectEncoded) => Effect.Effect<Project, Errors.createProjectError | ParseError>
  findById: (id: Branded.ProjectId) => Effect.Effect<Project, Errors.findProjectByIdError | ParseError | NoSuchElementException>
  findByIdWithRelations: (id: Branded.ProjectId) => Effect.Effect<ProjectWithRelationsSchema.ProjectWithRelations, Errors.findProjectByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<Project, Errors.findManyProjectError>
  findManyWithRelations: () => Effect.Effect<ProjectWithRelationsSchema.ProjectWithRelationsArray, Errors.findManyProjectError>
  update: (id: Branded.ProjectId, data: ProjectSchema.UpdateProjectEncoded) => Effect.Effect<Project, Errors.updateProjectError | ParseError>
  updatePartial: (id: Branded.OrganizationId, data: Partial<ProjectSchema.UpdateProjectEncoded>) => Effect.Effect<Project, Errors.updateProjectError>
  remove: (id: Branded.ProjectId) => Effect.Effect<Project, Errors.removeProjectError>
  hardRemove: (id: Branded.ProjectId) => Effect.Effect<Project, Errors.removeProjectError>
}
