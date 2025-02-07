import type { UserService } from "../../types/services/user.js"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { getCookie } from "hono/cookie"
import jwt from "jsonwebtoken"
import { Branded, Helpers, UserSchema } from "../../schema/index.js"
import "dotenv/config"

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
    },
  },
  tags: ["User"],
})

const getByUsernameResponseSchema = UserSchema.Schema.omit("deletedAt")

const getByUsernameDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(getByUsernameResponseSchema),
        },
      },
      description: "Get User by Username",
    },
    404: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Get user by Username",
    },
  },
  tags: ["User"],
})

// eslint-disable-next-line node/prefer-global/process
const SECRET_KEY = process.env.SECRET_KEY || "default-secret-key"

const getProfileDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(UserSchema.Schema.omit("deletedAt")),
        },
      },
      description: "Get Profile",
    },
    401: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Unauthorized",
    },
  },
  tags: ["User"],
})

const validateUserRequest = validator("param", S.Struct({
  userId: Branded.UserIdFromString,
}))

const validateusernameUserRequest = validator("param", S.Struct({
  username: UserSchema.UsernameSchema,
}))

export function setupUserGetRoutes(userService: UserService) {
  const app = new Hono()

  app.get("/", getManyDocs, async (c) => {
    const users = await userService.findMany()
    return c.json(Helpers.fromObjectToSchema(getManyResponseSchema)(users))
  })

  app.get("/:userId", getByIdDocs, validateUserRequest, async (c) => {
    const { userId } = c.req.valid("param")
    const user = await userService.findOneById(userId)
    if (user === null) {
      return c.json({ message: `not found user id: ${userId}` }, 404)
    }
    const response = getByIdResponseSchema.make(user)
    return c.json(response, 200)
  })

  app.get("/username/:username", getByUsernameDocs, validateusernameUserRequest, async (c) => {
    const { username } = c.req.valid("param")
    const user = await userService.findByUsername(username)
    if (user === null) {
      return c.json({ message: `not found user id: ${username}` }, 404)
    }
    const response = getByUsernameResponseSchema.make(user)
    return c.json(response, 200)
  })

  app.get("/profile/profile", getProfileDocs, async (c) => {
    const token = getCookie(c, "session")
    if (!token) {
      return c.json({ message: "Unauthorized: No session found" }, 401)
    }

    try {
      const payload = jwt.verify(token, SECRET_KEY) as { username: string }

      const user = await userService.findByUsername(payload.username)
      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      return c.json(Helpers.fromObjectToSchema(UserSchema.Schema.omit("deletedAt"))(user))
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      return c.json({ message: "Invalid or expired session" }, 401)
    }
  })

  return app
}
