import { config } from "@dotenvx/dotenvx"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { setupOpenApi } from "./config/openapi/setup-openapi.js"
import { setupScalarDocs } from "./config/openapi/setup-scalar-docs.js"
import healthzApp from "./controllers/healthz.js"
import initUserRepository from "./repositories/user/index.js"
import prismaClient from "./repositories/prisma.js"
import { initUserService } from "./services/user/index.js"
import * as UserController from "./controllers/users/index.js"


config()

const app = new Hono()
setupOpenApi(app)

const userRepository = initUserRepository(prismaClient)
const userService = initUserService(userRepository)
app.route("/users", UserController.setupUserRoutes(userService))

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
