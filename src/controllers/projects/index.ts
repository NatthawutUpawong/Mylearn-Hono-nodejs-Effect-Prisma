import { Hono } from "hono"
import * as DeleteRoutes from "./delete.js"
import * as GetRoutes from "./get.js"
import * as PostRoutes from "./post.js"
import * as PutRoutes from "./put.js"

export function setupProjectRoutes() {
  const app = new Hono()

  app.route("/", GetRoutes.setupProjectGetRoutes())
  app.route("/", PostRoutes.setupORGPostRoutes())
  app.route("/", PutRoutes.setupProjectPutRoutes())
  app.route("/", DeleteRoutes.setupDeleteRoutes())

  return app
}
