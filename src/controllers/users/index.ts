import type { UserService } from "../../types/services/user.js"
import { Hono } from "hono"
import * as GetRoutes from "./get.js"
import * as PostRoutes from "./post.js"
import * as PutRoutes from "./put.js"
import * as DeleteRoutes from "./delete.js"

export function setupUserRoutes(userService: UserService) {
  const app = new Hono()

  app.route("/", GetRoutes.setupUserGetRoutes(userService))
  app.route("/", PostRoutes.setupUserPostRoutes(userService))
  app.route("/", PutRoutes.setupUserPutRoutes(userService))
  app.route("/", DeleteRoutes.setupDeleteRoutes(userService))

  return app
}