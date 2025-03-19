import { config } from "@dotenvx/dotenvx"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { setupOpenApi } from "./config/openapi/setup-openapi.js"
import { setupScalarDocs } from "./config/openapi/setup-scalar-docs.js"
import * as AdminOrganizationController from "./controllers/adminorganizations/index.js"
import * as AdminProjectController from "./controllers/adminprojects/index.js"
import * as AdminRefreshTokenController from "./controllers/adminrefreshtoken/index.js"
import * as AdminUserController from "./controllers/adminusers/index.js"
import healthzApp from "./controllers/healthz.js"
import * as ORGController from "./controllers/organizations/index.js"
import * as ProjectController from "./controllers/projects/index.js"
import * as RefreshTokenController from "./controllers/refreshtoken/index.js"
import * as UserController from "./controllers/users/index.js"

config()

const app = new Hono()
setupOpenApi(app)

app.route("/admin", AdminUserController.setupUserByAdminRoutes())
app.route("/adminorganization", AdminOrganizationController.setupOrganizationByAdminRoutes())
app.route("/adminproject", AdminProjectController.setupProjectByAdminRoutes())
app.route("/adminrefreshToken", AdminRefreshTokenController.setupRefreshTokenByAdminRoutes())

app.route("/users", UserController.setupUserRoutes())
app.route("/organization", ORGController.setupOrganizationRoutes())
app.route("/project", ProjectController.setupProjectRoutes())
app.route("/refreshToken", RefreshTokenController.setupRefreshTokenRoutes())

app.route("/docs", setupScalarDocs())
app.route("/healthz", healthzApp)

app.get("/", (c) => {
  return c.text("Hello Hono!")
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
