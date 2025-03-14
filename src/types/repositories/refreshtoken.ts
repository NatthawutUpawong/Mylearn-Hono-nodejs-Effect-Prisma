import type { Effect } from "effect"

import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, RefreshTokenSchema } from "../../schema/index.js"
import type * as Errors from "../error/refreshtoken-errors.js"

type RefreshToken = RefreshTokenSchema.RefreshToken

export type RefreshTokenRepository = {
  create: (data: RefreshTokenSchema.CreateRefreshTokenEncode) => Effect.Effect<RefreshToken, Errors.createRefreshTokenError | ParseError>
  findByUserId: (id: Branded.UserId) => Effect.Effect<RefreshToken, Errors.findRefreshTokenUserByIdError | ParseError | NoSuchElementException>
  findByToken: (token: RefreshTokenSchema.RefreshToken["token"]) => Effect.Effect<RefreshToken, Errors.findRefreshTokenUserByTokenError | ParseError | NoSuchElementException>
  update: (id: Branded.RefreshTokenId, data: RefreshTokenSchema.UpdateRefreshTokenEncode) => Effect.Effect<RefreshToken, Errors.updateRefreshTokenError | ParseError>
  updatePartial: (id: Branded.RefreshTokenId, data: Partial<RefreshTokenSchema.UpdateRefreshTokenEncode>) => Effect.Effect<RefreshToken, Errors.updateRefreshTokenError>
  remove: (id: Branded.RefreshTokenId) => Effect.Effect<RefreshToken, Errors.removeRefreshTokenError>
  hardRemove: (id: Branded.RefreshTokenId) => Effect.Effect<RefreshToken, Errors.removeRefreshTokenError>
}
