import { Hono } from "hono"
import * as DeleteRoutes from "./delete.js"
import * as GetRoutes from "./get.js"
import * as PutRoutes from "./put.js"

export function setupUserByAdminRoutes() {
  const app = new Hono()

  app.route("/", GetRoutes.setupUserGetRoutes())
  app.route("/", PutRoutes.setupUserPutRoutes())
  app.route("/", DeleteRoutes.setupDeleteRoutes())

  return app
}
