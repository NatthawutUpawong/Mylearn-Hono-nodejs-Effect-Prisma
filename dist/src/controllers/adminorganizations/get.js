import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Branded, Helpers, OrganizationSchema, paginationSchema } from "../../schema/index.js";
import { OrganizationServiceContext } from "../../services/organization/index.js";
import * as UserErrors from "../../types/error/user-errors.js";
export function setupORGGetRoutes() {
    const app = new Hono();
    const getManyResponseSchema = S.Struct({
        data: S.Array(OrganizationSchema.Schema.omit("deletedAt")),
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
                description: "Get Organization",
            },
            500: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Get Many Organization Error",
            },
        },
        tags: ["Admin-Organization"],
    });
    app.get("/", authMiddleware, getManyDocs, async (c) => {
        const limit = Number(c.req.query("itemPerpage") ?? 10);
        const page = Number(c.req.query("page") ?? 1);
        const offset = (page - 1) * limit;
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema);
        const program = OrganizationServiceContext.pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")())), Effect.tap(() => Effect.log("start finding many Organization")), Effect.andThen(svc => svc.findManyPagination(limit, offset, page)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.catchTags({
            findManyORGError: () => Effect.succeed(c.json({ message: "find many Error" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /.organization.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    const getByIdResponseSchema = OrganizationSchema.Schema.omit("deletedAt");
    const getByIdDocs = describeRoute({
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: resolver(getByIdResponseSchema),
                    },
                },
                description: "Get Organization by Id",
            },
            404: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Get Organization By Id Not Found",
            },
        },
        tags: ["Admin-Organization"],
    });
    const validateORGRequest = validator("param", S.Struct({
        OrganizationId: Branded.OrganizationIdFromString,
    }));
    app.get("/:OrganizationId", authMiddleware, getByIdDocs, validateORGRequest, async (c) => {
        const { OrganizationId } = c.req.valid("param");
        const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema);
        const getUserPayload = c.get("userPayload");
        const program = OrganizationServiceContext.pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")())), Effect.tap(() => Effect.log("start finding by Id Organization")), Effect.andThen(svc => svc.findById(OrganizationId)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.andThen(b => b), Effect.catchTags({
            findORGByIdError: () => Effect.succeed(c.json({ message: "find by Id Error" }, 500)),
            NoSuchElementException: () => Effect.succeed(c.json({ message: `not found Id: ${OrganizationId}` }, 404)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /userId.Organization.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
