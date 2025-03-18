import type { Effect } from "effect"

import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, RefreshTokenSchema, RefreshTokenWithRelationSchema } from "../../schema/index.js"
import type * as Errors from "../error/refreshtoken-errors.js"

type RefreshToken = RefreshTokenSchema.RefreshToken

export type RefreshTokenRepository = {
  create: (data: RefreshTokenSchema.CreateRefreshTokenEncode) => Effect.Effect<RefreshToken, Errors.createRefreshTokenError | ParseError>
  findManyPagination: (limit: number, offset: number,) => Effect.Effect<RefreshTokenWithRelationSchema.RefreshTokenWithRelationsArray, Errors.findManyRefreshTokenError>
  finManyWithRelation: () => Effect.Effect<RefreshTokenWithRelationSchema.RefreshTokenWithRelationsArray, Errors.findManyRefreshTokenError>
  findByUserId: (id: Branded.UserId) => Effect.Effect<RefreshToken, Errors.findRefreshTokenByUserIdError | ParseError | NoSuchElementException>
  findByToken: (token: RefreshTokenSchema.RefreshToken["token"]) => Effect.Effect<RefreshToken, Errors.findRefreshTokenByTokenError | ParseError | NoSuchElementException>
  update: (id: Branded.RefreshTokenId, data: RefreshTokenSchema.UpdateRefreshTokenEncode) => Effect.Effect<RefreshToken, Errors.updateRefreshTokenError | ParseError>
  updatePartial: (id: Branded.RefreshTokenId, data: Partial<RefreshTokenSchema.UpdateRefreshTokenEncode>) => Effect.Effect<RefreshToken, Errors.updateRefreshTokenError>
  remove: (id: Branded.RefreshTokenId) => Effect.Effect<RefreshToken, Errors.removeRefreshTokenError>
  hardRemoveById: (id: Branded.RefreshTokenId) => Effect.Effect<RefreshToken, Errors.removeRefreshTokenError>
  hardRemoveByUserId: (id: Branded.UserId) => Effect.Effect<RefreshToken, Errors.removeRefreshTokenError>
  count: () => Effect.Effect<number, Errors.findManyRefreshTokenError>
}
