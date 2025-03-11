import type { UserSchema } from "../../schema/index.js"
import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, ProjectSchema } from "../../schema/index.js"
import { ProjectServiceContext } from "../../services/project/index.js"
import { ProjectRelationServiceContext } from "../../services/projectRelation/index.js"
import { UserroleCheckServiceContext } from "../../services/userauthen/index.js"
import * as ProjectErrors from "../../types/error/project-errors.js"
import * as ProRelErrors from "../../types/error/projectRelation-errors.js"
import * as UserErrors from "../../types/error/user-errors.js"

const responseSchema = ProjectSchema.Schema.omit("deletedAt")

const putDocss = honoOpenapi.describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(responseSchema),
        },
      },
      description: "Udate Project",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Udate Project Error",
    },
  },
  tags: ["Project"],
})

const validateRequestBody = validator("json", ProjectSchema.UpdateSchema)
const validateUpdateParam = validator("param", S.Struct({
  ProjectId: Branded.ProjectIdFromString,
}))

export function setupProjectPutRoutes() {
  const app = new Hono()

  app.put("/:ProjectId", authMiddleware, putDocss, validateRequestBody, validateUpdateParam, async (c) => {
    const body = c.req.valid("json")
    const { ProjectId } = c.req.valid("param")
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      ProjectRelationService: ProjectRelationServiceContext,
      ProjectService: ProjectServiceContext,
      UserCheckservice: UserroleCheckServiceContext,
    }).pipe(
      Effect.bind("projectRelation", ({ ProjectRelationService }) => ProjectRelationService.findById(ProjectId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(ProRelErrors.findProjectRelationtByIdError.new(`not found ${ProjectId}`)())),
      )),
      Effect.tap(({ projectRelation, UserCheckservice }) => UserCheckservice.userRoleCheckEffect(getUserPayload.role).pipe(
        Effect.andThen(result =>
          result === true
            ? UserCheckservice.userIdCheckEffect(projectRelation.userId, getUserPayload.id)
            : UserCheckservice.userORGCheckEffect(projectRelation.organizationId, getUserPayload.organizationId),
        ),
      ),
      ),
      Effect.bind("existingProject", ({ ProjectService }) => ProjectService.findById(ProjectId)),
      Effect.bind("newName", ({ existingProject }) =>
        Effect.succeed(body.name.trim() === ""
          ? existingProject.name
          : body.name)),
      Effect.tap(({ existingProject }) =>
        body.id === existingProject.id
          ? Effect.void
          : Effect.fail(ProjectErrors.ProjectIdNotMatchError.new(`Id from param and body id not match`)()),
      ),
      Effect.andThen(({ newName, ProjectService }) => ProjectService.update(ProjectId, { ...body, name: newName })),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        findProjectByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        findProjectRelationtByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 403)),
        ProjectIdNotMatchError: e => Effect.succeed(c.json({ message: e.msg }, 400)),
        updateProjectError: () => Effect.succeed(c.json({ message: "update failed" }, 500)),
      }),
      Effect.withSpan("PUT /.Project.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  const putDocssAdmin = honoOpenapi.describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(responseSchema),
          },
        },
        description: "Udate Project",
      },
      500: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Udate Project Error",
      },
    },
    tags: ["Admin-Project"],
  })

  app.put("Admin/:ProjectId", authMiddleware, putDocssAdmin, validateRequestBody, validateUpdateParam, async (c) => {
    const body = c.req.valid("json")
    const { ProjectId } = c.req.valid("param")
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      ProjectRelationService: ProjectRelationServiceContext,
      ProjectService: ProjectServiceContext,
      UserCheckservice: UserroleCheckServiceContext,
    }).pipe(
      Effect.tap(() =>
        getUserPayload.role === "User_Admin"
          ? Effect.void
          : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
      ),
      Effect.bind("existingProject", ({ ProjectService }) => ProjectService.findById(ProjectId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(ProjectErrors.findProjectByIdError.new(`not found Id: ${ProjectId}`)())),
      )),
      Effect.bind("newName", ({ existingProject }) =>
        Effect.succeed(body.name.trim() === ""
          ? existingProject.name
          : body.name)),
      Effect.tap(({ existingProject }) =>
        body.id === existingProject.id
          ? Effect.void
          : Effect.fail(ProjectErrors.ProjectIdNotMatchError.new("Id from param and body id not match")()),
      ),
      Effect.andThen(({ newName, ProjectService }) => ProjectService.update(ProjectId, { ...body, name: newName })),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.catchTags({
        findProjectByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        ProjectIdNotMatchError: e => Effect.succeed(c.json({ message: e.msg }, 400)),
        updateProjectError: () => Effect.succeed(c.json({ message: "update failed" }, 500)),
      }),
      Effect.withSpan("PUT /Project-By-Admin.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
