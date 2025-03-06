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
import * as Errors from "../../types/error/project-errors.js"

export function setupProjectGetRoutes() {
  const app = new Hono()

  const getManyResponseSchema = S.Array(ProjectSchema.Schema.omit("deletedAt"))

  const getManyDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getManyResponseSchema),
          },
        },
        description: "Get Project",
      },
      500: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Get Many Project Error",
      },
    },

    tags: ["Project"],
  })

  app.get("/", authMiddleware, getManyDocs, async (c) => {
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)
    // const whereCondition = { deletedAt: null }
    const program = Effect.all({
      ProjectService: ProjectServiceContext,
    }).pipe(

      // Effect.bind("whereCondition", () =>
      //   getUserPayload.role === "User"
      //     ?Effect.andThen("whereCondition", () => whereCondition = )
      //     :
      // ),
      Effect.bind("whereCondition", () =>
        Effect.succeed(
          getUserPayload.role === "User"
            ? { deletedAt: null, userId: getUserPayload.id }
            : getUserPayload.role === "User_ORG"
              ? { deletedAt: null, organizationId: getUserPayload.organizationId }
              : getUserPayload.role === "User_Admin"
                ? { deletedAt: null }
                : { deletedAt: null },
        )),
      Effect.andThen(b => b),
      Effect.tap(b => console.log(b)),

      Effect.tap(() => Effect.log("start finding many Project")),
      Effect.andThen(({ ProjectService, whereCondition }) => ProjectService.findMany(whereCondition)),
      Effect.andThen(b => b),

      Effect.andThen(parseResponse),

      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        findManyProjectError: () => Effect.succeed(c.json({ message: "find many error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /.Project.controller /"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  const getByIdResponseSchema = ProjectSchema.Schema.omit("deletedAt")

  const getByIdDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getByIdResponseSchema),
          },
        },
        description: "Get Project by Id",
      },
      404: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Get Project By Id Not Found",
      },
    },
    tags: ["Project"],
  })

  const validateProjectRequest = validator("param", S.Struct({
    reqProjectId: Branded.ProjectIdFromString,
  }))

  app.get("/:reqProjectId", authMiddleware, getByIdDocs, validateProjectRequest, async (c) => {
    const { reqProjectId } = c.req.valid("param")
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

    const program = Effect.all({
      ProjectService: ProjectServiceContext,
    }).pipe(
      Effect.bind("whereCondition", () =>
        Effect.succeed(
          getUserPayload.role === "User"
            ? { deletedAt: null, projectId: reqProjectId, userId: getUserPayload.id }
            : getUserPayload.role === "User_ORG"
              ? { deletedAt: null, organizationId: getUserPayload.organizationId, projectId: reqProjectId }
              : getUserPayload.role === "User_Admin"
                ? { deletedAt: null, projectId: reqProjectId }
                : { deletedAt: null, projectId: reqProjectId },
        )),
      Effect.andThen(b => b),

      Effect.tap(() => Effect.log("start finding by Id Project")),
      Effect.bind("foundProject", ({ ProjectService, whereCondition }) => ProjectService.findMany(whereCondition)),
      Effect.bind("idProjectReq", ({ foundProject }) => 
        Effect.succeed<Branded.ProjectId>(
          foundProject.length > 0 
            ? foundProject[0].id 
            : 0 as Branded.ProjectId
        )
      ),
      Effect.andThen(b => b),
      Effect.andThen(({ idProjectReq, ProjectService }) =>
        ProjectService.findById(idProjectReq).pipe(
                  Effect.catchTag("NoSuchElementException", () =>
                    Effect.fail(Errors.findProjectByIdError.new(`Project Id: ${reqProjectId} not found`)())),
        ),
      ),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.andThen(b => b),
      Effect.catchTags({
        findManyProjectError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        findProjectByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /ProjectId.Project.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })
  return app
}
