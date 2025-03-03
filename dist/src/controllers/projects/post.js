/* eslint-disable perfectionist/sort-objects */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable unused-imports/no-unused-imports */
import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import * as honoOpenapi from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { getCookie } from "hono/cookie";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Helpers, ProjectRelarionSchema, ProjectSchema, ProjectWithRelationsSchema } from "../../schema/index.js";
import { ProjectServiceContext } from "../../services/project/index.js";
import { ProjectRelationServiceContext } from "../../services/projectRelation/index.js";
import { JwtServiceContext } from "../../services/jwt/indext.js";
import * as ORGErrors from "../../types/error/ORG-errors.js";
import * as UserErrors from "../../types/error/user-errors.js";
const responseSchema = ProjectWithRelationsSchema.Schema.omit("deletedAt");
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
export function setupORGPostRoutes() {
    const app = new Hono();
    app.post("/", postDocs, validateRequestBody, async (c) => {
        const body = c.req.valid("json");
        const token = getCookie(c, "session");
        const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema);
        const program = Effect.succeed(token).pipe(Effect.andThen(token => token
            ? Effect.succeed(token)
            : Effect.fail(UserErrors.VerifyTokenError.new("Unauthorized")())), Effect.andThen(token => JwtServiceContext.pipe(Effect.andThen(svc => svc.VerifyToken(token)))), Effect.andThen(decoded => decoded), Effect.andThen(b => b), Effect.bind("projectInfo", () => ProjectServiceContext.pipe(Effect.andThen(svc => svc.create(body)), Effect.map(projectInfo => projectInfo))), Effect.andThen(body => ProjectRelationServiceContext.pipe(Effect.andThen(svc => svc.create({
            userId: body.id,
            organizationId: body.organizatonId,
            projectId: body.projectInfo.id,
        })))), Effect.andThen(b => b), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 201)), Effect.andThen(b => b), Effect.catchTags({
            VerifyTokenError: () => Effect.succeed(c.json({ message: "Unauthorized" }, 401)),
            createProjectError: () => Effect.succeed(c.json({ message: "create project error" }, 500)),
            createProjectRelationtError: () => Effect.succeed(c.json({ message: "create projectRelation error" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "Parse Error" }, 500)),
        }), Effect.withSpan("POST /.project.controller"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
