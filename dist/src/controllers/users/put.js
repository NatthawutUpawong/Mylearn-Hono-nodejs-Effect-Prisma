import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { deleteCookie } from "hono/cookie";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Branded, Helpers, UserSchema } from "../../schema/index.js";
import { OrganizationServiceContext } from "../../services/organization/index.js";
import { PasswordServiceContext } from "../../services/password/indext.js";
import { UserServiceContext } from "../../services/user/index.js";
import * as UserErrors from "../../types/error/user-errors.js";
const validateUpdateUserParam = validator("param", S.Struct({
    userId: Branded.UserIdFromString,
}));
export function setupUserPutRoutes() {
    const app = new Hono();
    const updateUserByUserResponseSchema = UserSchema.UpdateByUserSchema;
    const updateUserDocs = describeRoute({
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: resolver(updateUserByUserResponseSchema),
                    },
                },
                description: "Udate User",
            },
            500: {
                content: {
                    "application/json": {
                        schema: resolver(updateUserByUserResponseSchema),
                    },
                },
                description: "Update User Error",
            },
        },
        tags: ["User"],
    });
    const validateUpdateUserRequest = validator("json", UserSchema.UpdateByUserSchema);
    app.put("User/:userId", authMiddleware, updateUserDocs, validateUpdateUserRequest, validateUpdateUserParam, async (c) => {
        const body = c.req.valid("json");
        const { userId } = c.req.valid("param");
        const getUserPayload = c.get("userPayload");
        const parseResponse = Helpers.fromObjectToSchemaEffect(updateUserByUserResponseSchema);
        const programs = Effect.all({
            ORGService: OrganizationServiceContext,
            passwordService: PasswordServiceContext,
            userServices: UserServiceContext,
        })
            .pipe(Effect.bind("existingUser", ({ userServices }) => userServices.findOneById(userId).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(UserErrors.FindUserByIdError.new(`Id not found: ${userId}`)())))), Effect.bind("newUsername", ({ existingUser }) => Effect.succeed(body.username.trim() === "" ? existingUser.username : body.username)), Effect.bind("hashedPassword", ({ existingUser, passwordService }) => body.password.trim() === ""
            ? Effect.succeed(existingUser.password)
            : passwordService.hashedPassword(body.password)), Effect.tap(({ passwordService }) => body.password && body.password.trim() !== ""
            ? passwordService.isPassword8CharLongEffect(body.password)
            : Effect.void), Effect.tap(({ passwordService }) => body.password && body.password.trim() !== ""
            ? passwordService.isPasswordContainsSpecialCharEffect(body.password)
            : Effect.void), Effect.tap(({ newUsername, userServices }) => userServices.findByUsername(newUsername).pipe(Effect.andThen(user => user.id !== userId
            ? Effect.fail(UserErrors.UsernameAlreadyExitError.new(`Username already exists: ${newUsername}`)())
            : Effect.void), Effect.catchTag("NoSuchElementException", () => Effect.void))), Effect.andThen(b => b), Effect.tap(() => userId === getUserPayload.id
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to update other users' information")())), Effect.tap(({ existingUser }) => body.id === existingUser.id
            ? Effect.void
            : Effect.fail(UserErrors.UserIdMatchError.new("Id from param and body id not match")())), Effect.andThen(({ hashedPassword, newUsername, userServices }) => userServices.updateByUser(userId, { ...body, password: hashedPassword, username: newUsername }).pipe(Effect.tap(() => deleteCookie(c, "AccessToken")))), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 200)), Effect.catchTags({
            FindUserByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
            InvalidPasswordError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
            ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
            PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 403)),
            UserIdMatchError: e => Effect.succeed(c.json({ message: e.msg }, 400)),
            UsernameAlreadyExitError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        }), Effect.withSpan("PUT /user.controller"));
        const result = await ServicesRuntime.runPromise(programs);
        return result;
    });
    return app;
}
