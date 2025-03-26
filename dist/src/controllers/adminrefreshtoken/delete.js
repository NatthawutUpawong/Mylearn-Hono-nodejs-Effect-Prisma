import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Branded, Helpers, RefreshTokenSchema } from "../../schema/index.js";
import { RefreshTokenServiceContext } from "../../services/refreshtoken/index.js";
import * as RefreshtokenErrors from "../../types/error/refreshtoken-errors.js";
import * as UserErrors from "../../types/error/user-errors.js";
const deleteResponseSchema = RefreshTokenSchema.Schema.omit("deletedAt");
const deleteDocs = describeRoute({
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: resolver(deleteResponseSchema),
                },
            },
            description: "Delete Refreshtoken By UserId",
        },
        500: {
            content: {
                "application/json": {
                    schema: resolver(S.Struct({
                        message: S.String,
                    })),
                },
            },
            description: "Delete Refreshtoken Error",
        },
    },
    tags: ["Admin-RefreshToken"],
});
const validateDeleteRequest = validator("param", S.Struct({
    UserId: Branded.UserIdFromString,
}));
export function setupDeleteRoutes() {
    const app = new Hono();
    app.delete("/:UserId", authMiddleware, deleteDocs, validateDeleteRequest, async (c) => {
        const { UserId } = c.req.valid("param");
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(deleteResponseSchema);
        const program = Effect.all({
            RefreshTokenService: RefreshTokenServiceContext,
        }).pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")())), Effect.bind("refreshtoken", ({ RefreshTokenService }) => RefreshTokenService.findByUserId(UserId).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(RefreshtokenErrors.findRefreshTokenByUserIdError.new(`Not found user Id: ${UserId}`)())))), Effect.andThen(b => b), Effect.andThen(({ refreshtoken, RefreshTokenService }) => RefreshTokenService.hardRemoveByUserId(refreshtoken.userId)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.catchTags({
            findRefreshTokenByUserIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
            removeRefreshTokenError: () => Effect.succeed(c.json({ message: "remove Error" }, 500)),
        }), Effect.withSpan("DELETE /:userID.refreshtoken.controller"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
