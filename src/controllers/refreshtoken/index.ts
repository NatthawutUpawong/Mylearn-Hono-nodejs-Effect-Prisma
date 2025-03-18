import { Hono } from "hono"
import * as GetRoutes from "./get.js"
import * as PostRoutes from "./post.js"
import * as DeleteRoutes from "./delete.js"

export function setupRefreshTokenRoutes() {
  const app = new Hono()

  app.route("/", PostRoutes.setupRefreshTokenGetRoutes())
  app.route("/", GetRoutes.setupRefreshtokenGetRoutes())
  app.route("/", DeleteRoutes.setupDeleteRoutes())

  return app
}
