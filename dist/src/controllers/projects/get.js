import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Branded, Helpers, paginationSchema, ProjectSchema } from "../../schema/index.js";
import { ProjectServiceContext } from "../../services/project/index.js";
import { ProjectRelationServiceContext } from "../../services/projectRelation/index.js";
import { UserroleCheckServiceContext } from "../../services/userauthen/index.js";
import * as ProRelErrors from "../../types/error/projectRelation-errors.js";
export function setupProjectGetRoutes() {
    const app = new Hono();
    const getManyResponseSchema = S.Struct({
        data: S.Array(ProjectSchema.Schema.omit("deletedAt")),
        pagination: paginationSchema.Schema,
    });
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
    });
    app.get("/", authMiddleware, getManyDocs, async (c) => {
        const getUserPayload = c.get("userPayload");
        const limit = Number(c.req.query("itemPerpage") ?? 10);
        const page = Number(c.req.query("page") ?? 1);
        const offset = (page - 1) * limit;
        const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema);
        const program = Effect.all({
            ProjectRelationService: ProjectRelationServiceContext,
            UserCheckservice: UserroleCheckServiceContext,
        }).pipe(Effect.bind("whereCondition", ({ UserCheckservice }) => UserCheckservice.userRoleCheckEffect(getUserPayload.role).pipe(Effect.andThen(result => result === true
            ? Effect.succeed({ userId: getUserPayload.id })
            : Effect.succeed({ organizationId: getUserPayload.organizationId })))), Effect.andThen(b => b), Effect.andThen(({ ProjectRelationService, whereCondition }) => ProjectRelationService.findManyPagination(limit, offset, page, whereCondition)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.tap(() => Effect.log("test")), Effect.catchTags({
            findManyProjectRelationtError: () => Effect.succeed(c.json({ message: "find many Error" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /.Project.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    const getByIdResponseSchema = ProjectSchema.Schema.omit("deletedAt");
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
    });
    const validateProjectRequest = validator("param", S.Struct({
        ProjectId: Branded.ProjectIdFromString,
    }));
    app.get("/:ProjectId", authMiddleware, getByIdDocs, validateProjectRequest, async (c) => {
        const { ProjectId } = c.req.valid("param");
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema);
        const program = Effect.all({
            ProjectRelationService: ProjectRelationServiceContext,
            ProjectService: ProjectServiceContext,
            UserCheckservice: UserroleCheckServiceContext,
        }).pipe(Effect.andThen(b => b), Effect.bind("projectRelation", ({ ProjectRelationService }) => ProjectRelationService.findById(ProjectId).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(ProRelErrors.findProjectRelationtByIdError.new(`not found ${ProjectId}`)())))), Effect.tap(({ projectRelation, UserCheckservice }) => UserCheckservice.userRoleCheckEffect(getUserPayload.role).pipe(Effect.andThen(result => result === true
            ? UserCheckservice.userIdCheckEffect(projectRelation.userId, getUserPayload.id)
            : UserCheckservice.userORGCheckEffect(projectRelation.organizationId, getUserPayload.organizationId)))), Effect.andThen(({ ProjectService }) => ProjectService.findById(ProjectId)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.andThen(b => b), Effect.catchTags({
            findProjectByIdError: () => Effect.succeed(c.json({ message: "fin Project by Id Error" }, 500)),
            findProjectRelationtByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 403)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /ProjectId.Project.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
