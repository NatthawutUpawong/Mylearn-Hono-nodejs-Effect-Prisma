import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Branded, Helpers, UserSchema } from "../../schema/index.js";
import { UserServiceContext } from "../../services/user/index.js";
import * as Errors from "../../types/error/user-errors.js";
const deleteUserResponseSchema = UserSchema.Schema.omit("deletedAt");
const deleteUserDocs = describeRoute({
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: resolver(deleteUserResponseSchema),
                },
            },
            description: "Delete User By UserId",
        },
        500: {
            content: {
                "application/json": {
                    schema: resolver(S.Struct({
                        message: S.String,
                    })),
                },
            },
            description: "Delete User Error",
        },
    },
    tags: ["Admin-User"],
});
const validateDeleteUserRequest = validator("param", S.Struct({
    userId: Branded.UserIdFromString,
}));
export function setupDeleteRoutes() {
    const app = new Hono();
    app.delete("/:userId", authMiddleware, deleteUserDocs, validateDeleteUserRequest, async (c) => {
        const { userId } = c.req.valid("param");
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(deleteUserResponseSchema);
        const program = UserServiceContext.pipe(Effect.tap(() => getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(Errors.PermissionDeniedError.new("You do not have permission to access")())), Effect.bind("deletedUser", UserServiceContext => UserServiceContext.findOneById(userId).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(Errors.FindUserByIdError.new(`Not found user Id: ${userId}`)())))), Effect.andThen(b => b), Effect.andThen(svc => svc.removeById(userId)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.catchTags({
            FindUserByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
            RemoveUserError: () => Effect.succeed(c.json({ message: "remove Error" }, 500)),
        }), Effect.withSpan("DELETE /:userId.user.controller"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
