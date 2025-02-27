import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { getCookie } from "hono/cookie"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, UserSchema } from "../../schema/index.js"
import { JwtServiceContext } from "../../services/jwt/indext.js"
import { UserServiceContext } from "../../services/user/index.js"
import * as Errors from "../../types/error/user-errors.js"
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
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Get Many Users Error",
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
          schema: resolver(getByIdResponseSchema),
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
      description: "Get User By Id Not Found",
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
      description: "Get User By Username Not Found",
    },
  },
  tags: ["User"],
})

// const SECRET_KEY = process.env.SECRET_KEY || "default-secret-key"

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
  username: Branded.UsernameType,
}))

export function setupUserGetRoutes() {
  const app = new Hono()

  app.get("/", getManyDocs, async (c) => {
    const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

    const program = UserServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding many users")),
      Effect.andThen(svc => svc.findMany()),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindManyUserError: () => Effect.succeed(c.json({ message: "find many error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /.user.controller /"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  app.get("/:userId", getByIdDocs, validateUserRequest, async (c) => {
    const { userId } = c.req.valid("param")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

    const program = UserServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding by Id users")),
      Effect.andThen(svc => svc.findOneById(userId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.catchTags({
        FindUserByIdError: () => Effect.succeed(c.json({ message: "find by Id error" }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: `not found user for id: ${userId}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /userId.user.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  app.get("all/:userId", getByIdDocs, validateUserRequest, async (c) => {
    const { userId } = c.req.valid("param")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

    const program = UserServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding by Id users")),
      Effect.andThen(svc => svc.findallById(userId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindUserByIdError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: `not found user for id: ${userId}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /userId.user.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  app.get("/username/:username", getByUsernameDocs, validateusernameUserRequest, async (c) => {
    const { username } = c.req.valid("param")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getByUsernameResponseSchema)

    const program = UserServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding by Username users")),
      Effect.andThen(svc => svc.findByUsername(username)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindUserByUsernameError: () => Effect.succeed(c.json({ message: "find by Username error" }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: `not found user for Username: ${username}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /username.user.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  app.get("/profile/profile", getProfileDocs, async (c) => {
    const token = getCookie(c, "session")

    const program = Effect.succeed(token).pipe(
      Effect.andThen(token =>
        token
          ? Effect.succeed(token)
          : Effect.fail(Errors.VerifyTokenError.new("Unauthorized")()),
      ),
      Effect.andThen(token => JwtServiceContext.pipe(
        Effect.andThen(svc => svc.VerifyToken(token)),
      )),
      Effect.andThen(decoded => c.json({ decoded, message: "Profile data" })),
      Effect.catchTags({
        VerifyTokenError: () => Effect.succeed(c.json({ message: "Not found user" }, 401)),
      }),
    )

    return await ServicesRuntime.runPromise(program)
  })

  return app
}
