import { Hono } from "hono"
import * as DeleteRoutes from "./delete.js"
import * as GetRoutes from "./get.js"
import * as LoginRoutes from "./login.js"
import * as PostRoutes from "./post.js"
import * as PutRoutes from "./put.js"

export function setupUserRoutes() {
  const app = new Hono()

  app.route("/", GetRoutes.setupUserGetRoutes())
  app.route("/", PostRoutes.setupUserPostRoutes())
  // app.route("/", LoginRoutes.setupUserLoginRoute(userService))
  app.route("/", PutRoutes.setupUserPutRoutes())
  // app.route("/", DeleteRoutes.setupDeleteRoutes(userService))

  return app
}
