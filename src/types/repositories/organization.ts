import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, OrganizationSchema } from "../../schema/index.js"
import type * as Errors from "../error/ORG-errors.js"

type Organization = OrganizationSchema.Organization

export type OrganizationRepository = {
  create: (data: OrganizationSchema.CreateOrganizationEncoded) => Effect.Effect<Organization, Errors.createORGError | ParseError>
  findById: (id: Branded.OrganizationId) => Effect.Effect<Organization, Errors.findORGByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<OrganizationSchema.OrganizationArray, Errors.findManyORGError>
  update: (id: Branded.OrganizationId, data: OrganizationSchema.UpdateOrganizationEncoded) => Effect.Effect<Organization, Errors.updateORGError | ParseError>
  updatePartial: (id: Branded.OrganizationId, data: Partial<OrganizationSchema.UpdateOrganizationEncoded>) => Effect.Effect<Organization, Errors.updateORGError>
  remove: (id: Branded.OrganizationId) => Effect.Effect<Organization, Errors.removeORGError>
  hardRemove: (id: Branded.OrganizationId) => Effect.Effect<Organization, Errors.removeORGError>
}
