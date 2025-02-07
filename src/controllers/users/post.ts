import type { UserService } from "../../types/services/user.js"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { UserSchema } from "../../schema/index.js"

const responseSchema = UserSchema.Schema.omit("deletedAt")

const postDocs = honoOpenapi.describeRoute({
  responses: {
    201: {
      content: {
        "application/json": {
          schema: resolver(responseSchema),
        },
      },
      description: "Create User",
    },
  },
  tags: ["User"],
})

const validateRequestBody = validator("json", UserSchema.CreateSchema)

export function setupUserPostRoutes(userService: UserService) {
  const app = new Hono()

  app.post("/", postDocs, validateRequestBody, async (c) => {
    const body = c.req.valid("json")
    const result = await userService.create(body)
    return c.json(result)
  })

  return app
}
