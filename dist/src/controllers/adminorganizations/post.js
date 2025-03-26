import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import * as honoOpenapi from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Helpers, OrganizationSchema } from "../../schema/index.js";
import { OrganizationServiceContext } from "../../services/organization/index.js";
import * as ORGErrors from "../../types/error/ORG-errors.js";
import * as UserErrors from "../../types/error/user-errors.js";
const responseSchema = OrganizationSchema.Schema.omit("deletedAt");
const postDocs = honoOpenapi.describeRoute({
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: resolver(responseSchema),
                },
            },
            description: "Create Organization",
        },
        500: {
            content: {
                "application/json": {
                    schema: resolver(S.Struct({
                        message: S.String,
                    })),
                },
            },
            description: "Created Organization Error",
        },
    },
    tags: ["Admin-Organization"],
});
const validateRequestBody = validator("json", OrganizationSchema.CreateSchema);
export function setupORGPostRoutes() {
    const app = new Hono();
    app.post("/", authMiddleware, postDocs, validateRequestBody, async (c) => {
        const body = c.req.valid("json");
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema);
        const programs = Effect.all({
            ORGService: OrganizationServiceContext,
        }).pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")())), Effect.tap(() => Effect.log("create organization starting")), Effect.andThen(b => b), Effect.andThen(({ ORGService }) => ORGService.create(body)), Effect.andThen(b => b), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 201)), Effect.catchTags({
            createORGError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.withSpan("POST /.organization.controller"));
        const result = await ServicesRuntime.runPromise(programs);
        return result;
    });
    return app;
}
