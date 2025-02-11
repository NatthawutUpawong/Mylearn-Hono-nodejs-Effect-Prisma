import type { UserService } from "../../types/services/user.js"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { Branded, Helpers, UserSchema } from "../../schema/index.js"
import { PasswordServiceContext } from "../../services/password/hashpassword.js"
import { UserServiceContext } from "../../services/user/index.js"
import { Effect } from "effect"
import * as Errors from "../../types/error/user-errors.js"
import * as S from "effect/Schema"
import { ServicesRuntime } from "../../runtime/indext.js"

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
    }
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
        Effect.bind("existingUser", ({ userServices }) => 
          userServices.findOneById(userId).pipe(
            Effect.catchTag("NoSuchElementException", () => 
              Effect.fail(Errors.FindUserByIdError.new(`Id not found: ${userId}`)())
            )
          )
        ),
  
        Effect.bind("newUsername", ({ existingUser }) =>
          Effect.succeed(body.username.trim() === "" ? existingUser.username : body.username)
        ),
  
        Effect.bind("hashedPassword", ({ passwordService, existingUser }) =>
          body.password.trim() === ""
            ? Effect.succeed(existingUser.password)
            : passwordService.hashedPassword(body.password)
        ),
  
        Effect.tap(({ userServices, newUsername }) => 
          userServices.findByUsername(newUsername).pipe(
            Effect.andThen((user) => 
              user.id !== userId
                ? Effect.fail(Errors.UsernameAlreadyExitError.new(`Username already exists: ${newUsername}`)()) 
                : Effect.void
            ),
            Effect.catchTag("NoSuchElementException", () => Effect.void)
          )
        ),
  
        Effect.tap(({ userServices, existingUser }) => 
          body.id !== existingUser.id 
            ? userServices.findallById(body.id).pipe(
                Effect.andThen(() => 
                  Effect.fail(Errors.IdAlreadyExitError.new(`Id already exists: ${body.id}`)())
                ),
                Effect.catchTag("NoSuchElementException", () => Effect.void)
              )
            : Effect.void
        ),
        Effect.flatMap(({ userServices, newUsername, hashedPassword }) => 
          userServices.update(userId, { ...body, username: newUsername, password: hashedPassword })
        ),
  
        Effect.andThen(parseResponse),
        Effect.andThen(data => c.json(data, 200)),
  
        Effect.catchTags({
          UsernameAlreadyExitError: () => Effect.succeed(c.json({ message: `Username: ${body.username} already exists` }, 500)),
          IdAlreadyExitError: () => Effect.succeed(c.json({ message: `Id: ${body.id} already exists` }, 500)),
          FindUserByIdError: () => Effect.succeed(c.json({ message: `Not found Id: ${userId}` }, 404)),
        }),
  
        Effect.withSpan("PUT /.user.controller")
      )
    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}