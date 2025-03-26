import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Branded, Helpers, paginationSchema, UserSchema } from "../../schema/index.js";
import { UserServiceContext } from "../../services/user/index.js";
import * as Errors from "../../types/error/user-errors.js";
export function setupUserGetRoutes() {
    const app = new Hono();
    const getManyResponseSchema = S.Struct({
        data: S.Array(UserSchema.Schema.omit("deletedAt")),
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
                description: "Get User",
            },
            500: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Get Many Users Error",
            },
        },
        tags: ["Admin-User"],
    });
    app.get("/", authMiddleware, getManyDocs, async (c) => {
        const getUserPayload = c.get("userPayload");
        const limit = Number(c.req.query("itemPerpage") ?? 10);
        const page = Number(c.req.query("page") ?? 1);
        const offset = (page - 1) * limit;
        const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema);
        const program = UserServiceContext.pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(Errors.PermissionDeniedError.new("You do not have permission to access")())), Effect.tap(() => Effect.log("start finding many users")), Effect.andThen(svc => svc.findManyPagination(limit, offset, page)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.tap(() => Effect.log("test")), Effect.catchTags({
            FindManyUserError: () => Effect.succeed(c.json({ message: "find many Error" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /.user.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    const getByIdResponseSchema = UserSchema.Schema.omit("deletedAt");
    const getByIdDocs = describeRoute({
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: resolver(getByIdResponseSchema),
                    },
                },
                description: "Get User by Id",
            },
            404: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Get User By Id Not Found",
            },
        },
        tags: ["Admin-User"],
    });
    const validateUserRequest = validator("param", S.Struct({
        userId: Branded.UserIdFromString,
    }));
    app.get("/:userId", authMiddleware, getByIdDocs, validateUserRequest, async (c) => {
        const getUserPayload = c.get("userPayload");
        const { userId } = c.req.valid("param");
        const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema);
        const program = UserServiceContext.pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(Errors.PermissionDeniedError.new("You do not have permission to access")())), Effect.tap(() => Effect.log("start finding by Id users")), Effect.andThen(svc => svc.findOneById(userId)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.catchTags({
            FindUserByIdError: () => Effect.succeed(c.json({ message: "find by Id Error" }, 500)),
            NoSuchElementException: () => Effect.succeed(c.json({ message: `not found user for id: ${userId}` }, 404)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /userId.user.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    const getByUsernameResponseSchema = UserSchema.Schema.omit("deletedAt");
    const getByUsernameDocs = describeRoute({
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: resolver(getByUsernameResponseSchema),
                    },
                },
                description: "Get User by Username",
            },
            404: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Get User By Username Not Found",
            },
        },
        tags: ["Admin-User"],
    });
    const validateusernameUserRequest = validator("param", S.Struct({
        username: Branded.UsernameType,
    }));
    app.get("/username/:username", authMiddleware, getByUsernameDocs, validateusernameUserRequest, async (c) => {
        const { username } = c.req.valid("param");
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(getByUsernameResponseSchema);
        const program = UserServiceContext.pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(Errors.PermissionDeniedError.new("You do not have permission to access")())), Effect.tap(() => Effect.log("start finding by Username users")), Effect.andThen(svc => svc.findByUsername(username)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.tap(() => Effect.log("test")), Effect.catchTags({
            FindUserByUsernameError: () => Effect.succeed(c.json({ message: "find by Username Error" }, 500)),
            NoSuchElementException: () => Effect.succeed(c.json({ message: `not found user for Username: ${username}` }, 404)),
            ParseError: () => Effect.succeed(c.json({ message: "parse Error" }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        }), Effect.annotateLogs({ key: "annotate" }), Effect.withLogSpan("test"), Effect.withSpan("GET /username.user.controller /"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
