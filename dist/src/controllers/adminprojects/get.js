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
import * as UserErrors from "../../types/error/user-errors.js";
export function setupProjectGetRoutes() {
    const app = new Hono();
    const getManyResponseSchema = S.Struct({
        data: S.Array(ProjectSchema.Schema.omit("deletedAt")),
        pagination: paginationSchema.Schema,
    });
    const getManyDocsAdmin = describeRoute({
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
        tags: ["Admin-Project"],
    });
    app.get("/", authMiddleware, getManyDocsAdmin, async (c) => {
        const getUserPayload = c.get("userPayload");
        const limit = Number(c.req.query("itemPerpage") ?? 10);
        const page = Number(c.req.query("page") ?? 1);
        const offset = (page - 1) * limit;
        const whereCondition = { deletedAt: null };
        const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema);
        const program = Effect.all({
            ProjectRelationService: ProjectRelationServiceContext,
        }).pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")())), Effect.andThen(({ ProjectRelationService }) => ProjectRelationService.findManyPagination(limit, offset, page, whereCondition)), Effect.andThen(b => b), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.tap(() => Effect.log("test")), Effect.catchTags({
            findManyProjectRelationtError: () => Effect.succeed(c.json({ message: "find many Error" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /Project-By-Admin.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    const getByIdResponseSchema = ProjectSchema.Schema.omit("deletedAt");
    const validateProjectRequest = validator("param", S.Struct({
        ProjectId: Branded.ProjectIdFromString,
    }));
    const getByIdDocsAdmin = describeRoute({
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
        tags: ["Admin-Project"],
    });
    app.get("/:ProjectId", authMiddleware, getByIdDocsAdmin, validateProjectRequest, async (c) => {
        const { ProjectId } = c.req.valid("param");
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema);
        const program = Effect.all({
            ProjectService: ProjectServiceContext,
        }).pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")())), Effect.andThen(({ ProjectService }) => ProjectService.findById(ProjectId)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.catchTags({
            findProjectByIdError: () => Effect.succeed(c.json({ message: "fin Project by Id Error" }, 500)),
            NoSuchElementException: () => Effect.succeed(c.json({ message: `not found ${ProjectId}` }, 404)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /ProjectId-By-Admin.Project.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
