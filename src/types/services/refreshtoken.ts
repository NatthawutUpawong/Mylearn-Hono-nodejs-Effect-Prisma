import type { RefreshTokenRepository } from "../repositories/refreshtoken.js"

export type RefreshTokenService = {
  create: RefreshTokenRepository["create"]
  findByUserId: RefreshTokenRepository["findByUserId"]
  findByToken: RefreshTokenRepository["findByToken"]
  update: RefreshTokenRepository["update"]
  remove: RefreshTokenRepository["hardRemove"]
}
