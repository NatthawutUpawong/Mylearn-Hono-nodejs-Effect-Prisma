import type { UserRepository } from "../../types/repositories/user.js"
import type { UserService } from "../../types/services/user.js"
import jwt from "jsonwebtoken"

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

export function findByUsername(UserRepository: UserRepository): UserService["findByUsername"] {
  return async (username) => {
    return UserRepository.findByUsername(username)
  }
}

// eslint-disable-next-line node/prefer-global/process
const SECRET_KEY = process.env.SECRET_KEY || "default-secret-key"
export function getUserFromSession(UserRepository: UserRepository): UserService["getUserFromSession"] {
  return async (token) => {
    try {
      const payload = jwt.verify(token, SECRET_KEY) as { username: string }
      return UserRepository.findByUsername(payload.username)
    }
    catch {
      return null
    }
  }
}
