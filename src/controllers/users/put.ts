import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, UserSchema } from "../../schema/index.js"
import { PasswordServiceContext } from "../../services/password/indext.js"
import { UserServiceContext } from "../../services/user/index.js"
import * as Errors from "../../types/error/user-errors.js"

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
    500: {
      content: {
        "application/json": {
          schema: resolver(updateEmployeeResponseSchema),
        },
      },
      description: "Udate User Error",
    },
  },
  tags: ["User"],
})

const validateUpdateUserRequest = validator("json", UserSchema.UpdateSchema)
const validateUpdateUserParam = validator("param", S.Struct({
  userId: Branded.UserIdFromString,
}))

export function setupUserPutRoutes() {
  const app = new Hono()

  app.put("/:userId", updateUserDocs, validateUpdateUserRequest, validateUpdateUserParam, async (c) => {
    const body = c.req.valid("json")
    const { userId } = c.req.valid("param")

    const parseResponse = Helpers.fromObjectToSchemaEffect(updateEmployeeResponseSchema)

    const programs = Effect.all({
      passwordService: PasswordServiceContext,
      userServices: UserServiceContext,
    })
      .pipe(
        Effect.tap(() => Effect.log("Update starting")),
        Effect.bind("existingUser", ({ userServices }) =>
          userServices.findOneById(userId).pipe(
            Effect.catchTag("NoSuchElementException", () =>
              Effect.fail(Errors.FindUserByIdError.new(`Id not found: ${userId}`)())),
          )),

        Effect.bind("newUsername", ({ existingUser }) =>
          Effect.succeed(body.username.trim() === "" ? existingUser.username : body.username)),

        Effect.bind("hashedPassword", ({ existingUser, passwordService }) =>
          body.password.trim() === ""
            ? Effect.succeed(existingUser.password)
            : passwordService.hashedPassword(body.password)),

        Effect.tap(({ newUsername, userServices }) =>
          userServices.findByUsername(newUsername).pipe(
            Effect.andThen(user =>
              user.id !== userId
                ? Effect.fail(Errors.UsernameAlreadyExitError.new(`Username already exists: ${newUsername}`)())
                : Effect.void,
            ),
            Effect.catchTag("NoSuchElementException", () => Effect.void),
          ),
        ),

        Effect.tap(({ existingUser, userServices }) =>
          body.id !== existingUser.id
            ? userServices.findallById(body.id).pipe(
                Effect.andThen(() =>
                  Effect.fail(Errors.IdAlreadyExitError.new(`Id already exists: ${body.id}`)()),
                ),
                Effect.catchTag("NoSuchElementException", () => Effect.void),
              )
            : Effect.void,
        ),
        Effect.flatMap(({ hashedPassword, newUsername, userServices }) =>
          userServices.update(userId, { ...body, password: hashedPassword, username: newUsername }),
        ),

        Effect.andThen(parseResponse),
        Effect.andThen(data => c.json(data, 200)),

        Effect.catchTags({
          FindUserByIdError: () => Effect.succeed(c.json({ message: `Not found Id: ${userId}` }, 404)),
          IdAlreadyExitError: () => Effect.succeed(c.json({ message: `Id: ${body.id} can not be used` }, 500)),
          UsernameAlreadyExitError: () => Effect.succeed(c.json({ message: `Username: ${body.username} already exists` }, 500)),
        }),

        Effect.withSpan("PUT /.user.controller"),
      )
    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
