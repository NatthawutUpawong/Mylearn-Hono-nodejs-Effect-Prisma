/* eslint-disable perfectionist/sort-imports */
/* eslint-disable unused-imports/no-unused-imports */
import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import * as honoOpenapi from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Helpers, ProjectRelaionSchema, ProjectRelationsWithRelationsSchema, ProjectSchema } from "../../schema/index.js";
import { authMiddleware } from "../../middleware/auth.js";
import { ProjectServiceContext } from "../../services/project/index.js";
import { ProjectRelationServiceContext } from "../../services/projectRelation/index.js";
const responseSchema = ProjectRelationsWithRelationsSchema.Schema.omit("deletedAt");
const postDocs = honoOpenapi.describeRoute({
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: resolver(responseSchema),
                },
            },
            description: "Create Project",
        },
        500: {
            content: {
                "application/json": {
                    schema: resolver(S.Struct({
                        message: S.String,
                    })),
                },
            },
            description: "Created Project Error",
        },
    },
    tags: ["Project"],
});
const validateRequestBody = validator("json", ProjectSchema.CreateSchema);
export function setupProjectPostRoutes() {
    const app = new Hono();
    app.post("/", postDocs, authMiddleware, validateRequestBody, async (c) => {
        const getUserPayload = c.get("userPayload");
        const body = c.req.valid("json");
        const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema);
        const program = Effect.all({
            ProjectRelationService: ProjectRelationServiceContext,
            ProjectService: ProjectServiceContext,
        }).pipe(Effect.bind("createProjectInfo", ({ ProjectService }) => ProjectService.create(body).pipe()), Effect.andThen(({ createProjectInfo, ProjectRelationService }) => ProjectRelationService.create({
            organizationId: getUserPayload.organizationId,
            projectId: createProjectInfo.id,
            userId: getUserPayload.id,
        })), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 201)), Effect.catchTags({
            createProjectError: () => Effect.succeed(c.json({ message: "create project error" }, 500)),
            createProjectRelationtError: () => Effect.succeed(c.json({ message: "create projectRelation error" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "Parse Error" }, 500)),
        }), Effect.withSpan("POST /.project.controller"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
