import type { UserRepository } from "../../types/repositories/user.js"
import type { UserService } from "../../types/services/user.js"
import argon2 from "argon2"

export function create(userRepository: UserRepository): UserService["create"] {
  return async (data) => {

    const hashedPassword = await argon2.hash(data.password)

    const employee = await userRepository.create({
      ...data,
      password: hashedPassword,
      
    })
    return employee
  }
}