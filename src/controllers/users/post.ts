import { describeRoute } from "hono-openapi"
import { Helpers, UserSchema } from "../../schema/index.js"
import { resolver, validator } from "hono-openapi/effect"
import type { UserService } from "../../types/services/user.js"
import { Hono } from "hono"


const responseSchema = UserSchema.Schema.omit("deletedAt")

const postDocs = describeRoute({
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

  app.post("/", postDocs, validateRequestBody, async(c) => {
    const body = c.req.valid("json")
    const result = await userService.create(body)
    return c.json(result)
  })

  return app
}