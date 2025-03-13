import type { UserSchema } from "../../schema/index.js"
import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, ProjectSchema } from "../../schema/index.js"
import { ProjectServiceContext } from "../../services/project/index.js"
import * as ProjectErrors from "../../types/error/project-errors.js"
import * as UserErrors from "../../types/error/user-errors.js"

const deleteUserResponseSchema = ProjectSchema.Schema.omit("deletedAt")

const deleteUserDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(deleteUserResponseSchema),
        },
      },
      description: "Delete Project By UserId",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Delete Project Error",
    },
  },
  tags: ["Admin-Project"],
})

const validateDeleteUserRequest = validator("param", S.Struct({
  projectId: Branded.ProjectIdFromString,
}))

export function setupDeleteRoutes() {
  const app = new Hono()

  app.delete("/:projectId", authMiddleware, deleteUserDocs, validateDeleteUserRequest, async (c) => {
    const { projectId } = c.req.valid("param")
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(deleteUserResponseSchema)

    const program = ProjectServiceContext.pipe(
      Effect.tap(() =>
        getUserPayload.role === "User_Admin"
          ? Effect.void
          : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
      ),
      Effect.bind("deletedProject", ProjectServiceContext =>
        ProjectServiceContext.findById(projectId).pipe(
          Effect.catchTag("NoSuchElementException", () =>
            Effect.fail(ProjectErrors.findProjectByIdError.new(`Not found user Id: ${projectId}`)())),
        )),

      Effect.andThen(svc => svc.remove(projectId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        findProjectByIdError: () => Effect.succeed(c.json({ message: `Not found Id: ${projectId}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        removeProjectError: () => Effect.succeed(c.json({ message: "remove error" }, 500)),
      }),
      Effect.withSpan("DELETE /:userId.user.controller"),
    )

    const result = await ServicesRuntime.runPromise(program)

    return result
  })

  return app
}
