import type { UserService } from "../../types/services/user.js"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { UserSchema } from "../../schema/index.js"

const updateEmployeeResponseSchema = UserSchema.Schema.omit("deletedAt")

const updateUserDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(updateEmployeeResponseSchema),
        },
      },
      description: "Udate User",
    },
  },
  tags: ["User"],
})

const validateUpdateEmployeeRequest = validator("json", UserSchema.UpdateSchema)

export function setupUserPutRoutes(userService: UserService) {
  const app = new Hono()

  app.put("/", updateUserDocs, validateUpdateEmployeeRequest, async (c) => {
    const data = c.req.valid("json")
    const updated = await userService.update(data.id, data)
    if (updated === null) {
      return c.json({ message: `not found employee of id: ${data.id}` }, 404)
    }
    const resData = updateEmployeeResponseSchema.make(updated)
    return c.json(resData, 200)
  })

  return app
}