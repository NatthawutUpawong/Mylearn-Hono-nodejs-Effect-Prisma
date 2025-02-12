import type { UserRepository } from "../../types/repositories/user.js"
import type { UserService } from "../../types/services/user.js"
import argon2 from "argon2"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

// eslint-disable-next-line node/prefer-global/process
const SECRET_KEY = process.env.SECRET_KEY || "default-secret-key" 

function login(userRepository: UserRepository): UserService["login"] {
  return async (username, data) => {
    const user = await userRepository.findByUsername(username)
    if (!user)
      throw new Error("Invalid username or password")

    const match = await argon2.verify(user.password, data.password)
    if (!match)
      throw new Error("Invalid username or password")

    const token = jwt.sign({ username: data.username }, SECRET_KEY, { expiresIn: "1h" })
    const result = { token, user }
    // console.log(token)
    return result
  }
}
