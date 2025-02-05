import type { UserService } from "../../types/services/user.js"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { Branded, UserSchema } from "../../schema/index.js"

const deleteUserResponseSchema = UserSchema.Schema.omit("deletedAt")

const deleteUserDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(deleteUserResponseSchema),
        },
      },
      description: "Get user by userId",
    },
  },
  tags: ["User"],
})

const validateDeleteUserRequest = validator("param", S.Struct({
  userId: Branded.UserIdFromString,
}))

export function setupDeleteRoutes(userService: UserService) {
  const app = new Hono()

  app.delete("/:userId", deleteUserDocs, validateDeleteUserRequest, async (c) => {
    const { userId } = c.req.valid("param")
    const deletedData = await userService.removeById(userId)
    if (deletedData === null) {
      return c.json({ message: `not found employee of id: ${userId}` }, 404)
    }
    const resData = deleteUserResponseSchema.make(deletedData)
    return c.json(resData, 200)
  })

  return app
}