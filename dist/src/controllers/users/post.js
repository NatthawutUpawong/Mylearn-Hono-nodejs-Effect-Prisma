/* eslint-disable perfectionist/sort-objects */
import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import * as honoOpenapi from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { deleteCookie, setCookie } from "hono/cookie";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Helpers, UserSchema } from "../../schema/index.js";
import { JwtServiceContext } from "../../services/jwt/indext.js";
import { PasswordServiceContext } from "../../services/password/indext.js";
import { UserServiceContext } from "../../services/user/index.js";
import * as Errors from "../../types/error/user-errors.js";
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
                    schema: resolver(responseSchema),
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
const logoutDocs = honoOpenapi.describeRoute({
    responses: {
        200: {
            content: {
                "application/json": {},
            },
            description: "Login User",
        },
    },
    tags: ["User"],
});
const validateLoginRequestBody = validator("json", UserSchema.LoginSchema);
export function setupUserPostRoutes() {
    const app = new Hono();
    app.post("/", postDocs, validateRequestBody, async (c) => {
        const body = c.req.valid("json");
        const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema);
        const programs = Effect.all({
            passwordService: PasswordServiceContext,
            userServices: UserServiceContext,
        }).pipe(Effect.tap(() => Effect.log("Signup starting")), Effect.tap(({ userServices }) => userServices.findByUsername(body.username).pipe(Effect.andThen(() => Effect.fail(Errors.UsernameAlreadyExitError.new(`Username: ${body.username} already exists`)())), Effect.catchTag("NoSuchElementException", () => Effect.void))), Effect.andThen(b => b), Effect.tap(({ passwordService }) => passwordService.isPassword8CharLongEffect(body.password)), Effect.tap(({ passwordService }) => passwordService.isPasswordContainsSpecialCharEffect(body.password)), Effect.bind("hashedPassword", ({ passwordService }) => passwordService.hashedPassword(body.password)), Effect.andThen(({ hashedPassword, userServices }) => userServices.create({ ...body, password: hashedPassword })), Effect.andThen(b => b), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 201)), Effect.catchTags({
            CreateUserError: () => Effect.succeed(c.json({ message: "create error" }, 500)),
            InvalidPasswordError: e => Effect.succeed(c.json({ message: e.msg }, 400)),
            UsernameAlreadyExitError: e => Effect.succeed(c.json({ message: e.msg }, 409)),
        }), Effect.withSpan("POST /.user.controller"));
        const result = await ServicesRuntime.runPromise(programs);
        return result;
    });
    app.post("/login", loginDocs, validateLoginRequestBody, async (c) => {
        const body = c.req.valid("json");
        const programs = Effect.all({
            jwtServices: JwtServiceContext,
            passwordService: PasswordServiceContext,
            userServices: UserServiceContext,
        }).pipe(Effect.tap(() => Effect.log("Login process strating")), Effect.bind("user", ({ userServices }) => userServices.findByUsername(body.username)), Effect.andThen(b => b), Effect.bind("validPassword", ({ passwordService, user }) => passwordService.isValidPassword(user.password, body.password)), Effect.andThen(b => b), Effect.andThen(({ jwtServices, user, validPassword }) => validPassword
            ? jwtServices.SignToken({
                id: user.id,
                username: user.username,
                role: user.role,
                organizatonId: user.organizationId,
            }).pipe(Effect.tap(token => setCookie(c, "session", token, {
                httpOnly: true,
                maxAge: 60 * 5,
                sameSite: "Strict",
                secure: true,
            })))
            : Effect.fail(Errors.VerifyPasswordError.new("Invalided Username or Password ")())), Effect.andThen(token => c.json({ message: "Login success", token })), Effect.catchTags({
            FindUserByUsernameError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
            NoSuchElementException: () => Effect.succeed(c.json({ message: "Invalided Username or Password" }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "Paser data error" }, 500)),
            VerifyPasswordError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        }), Effect.withSpan("POST /.user.controller"));
        const result = await ServicesRuntime.runPromise(programs);
        return result;
    });
    app.post("/logout", logoutDocs, async (c) => {
        deleteCookie(c, "session");
        return c.json({ message: "Logged out successfully" });
    });
    return app;
}
