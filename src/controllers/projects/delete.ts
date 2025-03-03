import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, ProjectSchema } from "../../schema/index.js"
import { ProjectServiceContext } from "../../services/project/index.js"
import * as Errors from "../../types/error/ORG-errors.js"

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
  tags: ["Project"],
})

const validateDeleteUserRequest = validator("param", S.Struct({
  projectId: Branded.ProjectIdFromString,
}))

export function setupDeleteRoutes() {
  const app = new Hono()

  app.delete("/:projectId", deleteUserDocs, validateDeleteUserRequest, async (c) => {
    const { projectId } = c.req.valid("param")

    const parseResponse = Helpers.fromObjectToSchemaEffect(deleteUserResponseSchema)

    const program = ProjectServiceContext.pipe(

      Effect.bind("deletedProject", OrganizationServiceContext =>
        OrganizationServiceContext.findById(projectId).pipe(
          Effect.catchTag("NoSuchElementException", () =>
            Effect.fail(Errors.findORGByIdError.new(`Not found user Id: ${projectId}`)())),
        )),

      Effect.andThen(svc => svc.remove(projectId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        findORGByIdError: () => Effect.succeed(c.json({ message: `Not found Id: ${projectId}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        removeProjectError: () => Effect.succeed(c.json({ message: "remove error" }, 500)),
      }),
      Effect.withSpan("DELETE /:employeeId.employee.controller"),
    )

    const result = await ServicesRuntime.runPromise(program)

    return result
  })

  return app
}
