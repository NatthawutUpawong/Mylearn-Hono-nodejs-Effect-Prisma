import type { RefreshTokenRepository } from "../repositories/refreshtoken.js"

export type RefreshTokenService = {
  create: RefreshTokenRepository["create"]
  findByUserId: RefreshTokenRepository["findByUserId"]
  update: RefreshTokenRepository["update"]
  remove: RefreshTokenRepository["hardRemove"]
}
