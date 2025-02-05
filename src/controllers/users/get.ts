import { describeRoute } from "hono-openapi"
import { Branded, Helpers, UserSchema } from "../../schema/index.js"
import * as S from "effect/Schema"
import type { UserService } from "../../types/services/user.js"
import { resolver, validator } from "hono-openapi/effect"
import { Hono } from "hono"


const getManyResponseSchema = S.Array(UserSchema.Schema.omit("deletedAt"))

const getManyDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(getManyResponseSchema),
        },
      },
      description: "Get User",
    },
  },
  tags: ["User"],
})

const getByIdResponseSchema = UserSchema.Schema.omit("deletedAt")

const getByIdDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(getManyResponseSchema),
        },
      },
      description: "Get User by Id",
    },
    404: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Get user by Id",
    }
  },
  tags: ["User"],
})

const validateDeleteUserRequest = validator("param", S.Struct({
  userId: Branded.UserIdFromString,
}))

export function setupUserGetRoutes(userService: UserService) {
  const app = new Hono()

  app.get("/", getManyDocs, async(c) => {
    const users = await userService.findMany()
    return c.json(Helpers.fromObjectToSchema(getManyResponseSchema)(users))
  })

  app.get("/:userId", getByIdDocs, validateDeleteUserRequest, async (c) => {
    const {userId} = c.req.valid("param")
    const user = await userService.findOneById(userId)
    if (user === null){
      return c.json({message: `not found user id: ${userId}`}, 404)
    }
    const response = getByIdResponseSchema.make(user)
    return c.json(response, 200)
  })

  return app
}