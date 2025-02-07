import type { UserRepository } from "../../types/repositories/user.js"
import type { UserService } from "../../types/services/user.js"
import * as Creates from "./create.js"
import * as Finds from "./finds.js"
import * as Login from "./login.js"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"

export function initUserService(userRepository: UserRepository): UserService {
  return {
    create: Creates.create(userRepository),
    findByUsername: Finds.findByUsername(userRepository),
    findMany: Finds.findMany(userRepository),
    findOneById: Finds.findOneById(userRepository),
    getUserFromSession: Finds.getUserFromSession(userRepository),
    login: Login.login(userRepository),
    removeById: Removes.removeById(userRepository),
    update: Updates.update(userRepository)
  }
}
