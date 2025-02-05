import type { UserRepository } from "../../types/repositories/user.js"
import type { UserService } from "../../types/services/user.js"

export function findMany(UserRepository: UserRepository): UserService["findMany"] {
  return async () => {
    return UserRepository.findMany()
  }
}

export function findOneById(UserRepository: UserRepository): UserService["findOneById"] {
  return async (id) => {
    return UserRepository.findById(id)
  }
}
