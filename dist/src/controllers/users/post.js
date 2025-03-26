/* eslint-disable perfectionist/sort-objects */
import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import * as honoOpenapi from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { deleteCookie } from "hono/cookie";
import { authMiddleware } from "../../middleware/auth.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Helpers, UserSchema } from "../../schema/index.js";
import { JwtServiceContext } from "../../services/jwt/indext.js";
import { OrganizationServiceContext } from "../../services/organization/index.js";
import { PasswordServiceContext } from "../../services/password/indext.js";
import { RefreshTokenServiceContext } from "../../services/refreshtoken/index.js";
import { UserServiceContext } from "../../services/user/index.js";
import * as ORGErrors from "../../types/error/ORG-errors.js";
import * as UserErrors from "../../types/error/user-errors.js";
export function setupUserPostRoutes() {
    const app = new Hono();
    const responseSchema = UserSchema.Schema.omit("deletedAt");
    const postDocs = honoOpenapi.describeRoute({
        responses: {
            201: {
                content: {
                    "application/json": {
                        schema: resolver(responseSchema),
                    },
                },
                description: "Create User",
            },
            500: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Created User Error",
            },
        },
        tags: ["User"],
    });
    const validateRequestBody = validator("json", UserSchema.CreateSchema);
    const loginDocs = honoOpenapi.describeRoute({
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.Literal("Login success"),
                        })),
                    },
                },
                description: "Login User",
            },
            500: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Login Error",
            },
        },
        tags: ["User"],
    });
    app.post("/", postDocs, validateRequestBody, async (c) => {
        const body = c.req.valid("json");
        const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema);
        const programs = Effect.all({
            passwordService: PasswordServiceContext,
            userServices: UserServiceContext,
            ORGService: OrganizationServiceContext,
        }).pipe(Effect.tap(() => Effect.log("Signup starting")), Effect.tap(({ ORGService }) => body.organizationId === null
            ? Effect.void
            : ORGService.findById(body.organizationId).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(ORGErrors.findORGByIdError.new(`ORG Id: ${body.organizationId} nofound`)())))), Effect.tap(({ userServices }) => userServices.findByUsername(body.username).pipe(Effect.andThen(() => Effect.fail(UserErrors.UsernameAlreadyExitError.new(`Username: ${body.username} already exists`)())), Effect.catchTag("NoSuchElementException", () => Effect.void))), Effect.andThen(b => b), Effect.tap(({ passwordService }) => passwordService.isPassword8CharLongEffect(body.password)), Effect.tap(({ passwordService }) => passwordService.isPasswordContainsSpecialCharEffect(body.password)), Effect.bind("hashedPassword", ({ passwordService }) => passwordService.hashedPassword(body.password)), Effect.andThen(({ hashedPassword, userServices }) => userServices.create({ ...body, password: hashedPassword })), Effect.andThen(b => b), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 201)), Effect.catchTags({
            CreateUserError: () => Effect.succeed(c.json({ message: "create Error" }, 500)),
            InvalidPasswordError: e => Effect.succeed(c.json({ message: e.msg }, 400)),
            UsernameAlreadyExitError: e => Effect.succeed(c.json({ message: e.msg }, 409)),
            findORGByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        }), Effect.withSpan("POST /.user.controller"));
        const result = await ServicesRuntime.runPromise(programs);
        return result;
    });
    const logoutDocs = honoOpenapi.describeRoute({
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.Literal("Logged out successfully"),
                        })),
                    },
                },
                description: "Logout User",
            },
            500: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Logout Error",
            },
        },
        tags: ["User"],
    });
    const validateLoginRequestBody = validator("json", UserSchema.LoginSchema);
    app.post("/login", loginDocs, validateLoginRequestBody, async (c) => {
        const body = c.req.valid("json");
        const programs = Effect.all({
            jwtServices: JwtServiceContext,
            passwordService: PasswordServiceContext,
            userServices: UserServiceContext,
            refreshtokenservice: RefreshTokenServiceContext,
        }).pipe(Effect.tap(() => Effect.log("Login process strating")), Effect.bind("user", ({ userServices }) => userServices.findByUsername(body.username).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(UserErrors.FindUserByUsernameError.new(`Invalided Username or Password`)())))), Effect.bind("validPassword", ({ passwordService, user }) => passwordService.isValidPassword(user.password, body.password)), Effect.tap(({ validPassword }) => !validPassword
            ? Effect.fail(UserErrors.VerifyPasswordError.new("Invalided Username or Password")())
            : Effect.void), Effect.bind("RefreshToken", ({ jwtServices }) => jwtServices.SignToken()), Effect.bind("AccessToken", ({ jwtServices, user }) => jwtServices.SignTokenWihtPayload({
            id: user.id,
            username: user.username,
            role: user.role,
            organizationId: user.organizationId,
        })), Effect.tap(({ refreshtokenservice, user, RefreshToken }) => refreshtokenservice.findByUserId(user.id).pipe(Effect.catchTags({
            NoSuchElementException: () => refreshtokenservice.create({ userId: user.id, token: RefreshToken }),
        }), Effect.tap(token => refreshtokenservice.update(token.id, { id: token.id, userId: token.userId, token: RefreshToken })))), Effect.tap(({ RefreshToken, jwtServices }) => jwtServices.SetTokenCookie(c, "RefreshToken", RefreshToken, 60 * 60 * 24 * 7)), Effect.tap(({ AccessToken, jwtServices }) => jwtServices.SetTokenCookie(c, "AccessToken", AccessToken, 60 * 5)), Effect.andThen(() => c.json({ message: "Login success" })), Effect.catchTags({
            FindUserByUsernameError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
            findRefreshTokenByUserIdError: () => Effect.succeed(c.json({ message: "find token Error" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "Paser data Error" }, 500)),
            VerifyPasswordError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
            SetCookieError: () => Effect.succeed(c.json({ message: "set cookie Error" }, 500)),
            SignTokenError: () => Effect.succeed(c.json({ message: "sign token Error" }, 500)),
        }), Effect.withSpan("POST /.user.controller"));
        const result = await ServicesRuntime.runPromise(programs);
        return result;
    });
    app.post("/logout", authMiddleware, logoutDocs, async (c) => {
        const getUserPayload = c.get("userPayload");
        const program = RefreshTokenServiceContext.pipe(Effect.tap(service => service.findByUserId(getUserPayload.id).pipe(Effect.tap(RefreshToken => service.hardRemoveById(RefreshToken.id)), Effect.tap(() => deleteCookie(c, "RefreshToken")), Effect.tap(() => deleteCookie(c, "AccessToken")))), Effect.andThen(() => c.json({ message: "Logged out successfully" })), Effect.catchTags({
            findRefreshTokenByUserIdError: () => Effect.succeed(c.json({ message: "find token Error" }, 500)),
            removeRefreshTokenError: () => Effect.succeed(c.json({ message: "remove token Error" }, 500)),
        }), Effect.withSpan("POST /:user.logout.controller"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
