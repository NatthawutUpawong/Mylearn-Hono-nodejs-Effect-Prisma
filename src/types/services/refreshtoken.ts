import type { Effect } from "effect"
import type { paginationSchema, RefreshTokenWithRelationSchema } from "../../schema/index.js"
import type * as Errors from "../error/refreshtoken-errors.js"
import type { RefreshTokenRepository } from "../repositories/refreshtoken.js"

export type RefreshTokenService = {
  create: RefreshTokenRepository["create"]
  findMany: RefreshTokenRepository["finManyWithRelation"]
  findManyPagination: (limit: number, offset: number, page: number) => Effect.Effect<{
    data: RefreshTokenWithRelationSchema.RefreshTokenWithRelationsArray
    pagination: paginationSchema.pagination
  }, Errors.findManyRefreshTokenError>
  findByUserId: RefreshTokenRepository["findByUserId"]
  findByToken: RefreshTokenRepository["findByToken"]
  update: RefreshTokenRepository["update"]
  hardRemoveById: RefreshTokenRepository["hardRemoveById"]
  hardRemoveByUserId: RefreshTokenRepository["hardRemoveByUserId"]
}
