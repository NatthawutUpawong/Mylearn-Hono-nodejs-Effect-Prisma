import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import * as honoOpenapi from "hono-openapi";
import { resolver } from "hono-openapi/effect";
import { getCookie } from "hono/cookie";
import { refreshTokenMiddleware } from "../../middleware/refreshtoken.js";
import { ServicesRuntime } from "../../runtime/indext.js";
import { JwtServiceContext } from "../../services/jwt/indext.js";
import { RefreshTokenServiceContext } from "../../services/refreshtoken/index.js";
import { UserServiceContext } from "../../services/user/index.js";
import * as RefreshTokenErrors from "../../types/error/refreshtoken-errors.js";
import * as UserErrors from "../../types/error/user-errors.js";
export function setupRefreshTokenGetRoutes() {
    const app = new Hono();
    const RefreshDocs = honoOpenapi.describeRoute({
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.Literal("Token refreshed successfully"),
                        })),
                    },
                },
                description: "Refresh Token",
            },
            500: {
                content: {
                    "application/json": {
                        schema: resolver(S.Struct({
                            message: S.String,
                        })),
                    },
                },
                description: "Refresh Token Error",
            },
        },
        tags: ["RefreshToken"],
    });
    app.post("/", refreshTokenMiddleware, RefreshDocs, async (c) => {
        const token = getCookie(c, "RefreshToken");
        const programs = Effect.all({
            jwtServices: JwtServiceContext,
            refreshtokenservice: RefreshTokenServiceContext,
            userServices: UserServiceContext,
        }).pipe(Effect.bind("RefreshToken", ({ refreshtokenservice }) => refreshtokenservice.findByToken(token).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(RefreshTokenErrors.findRefreshTokenByTokenError.new(`Unauthorized`)())))), Effect.bind("user", ({ RefreshToken, userServices }) => userServices.findOneById(RefreshToken.userId).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(UserErrors.FindUserByIdError.new(`Find user Error`)())))), Effect.bind("AccessToken", ({ jwtServices, user }) => jwtServices.SignTokenWihtPayload({
            id: user.id,
            organizationId: user.organizationId,
            role: user.role,
            username: user.username,
        })), Effect.tap(({ AccessToken, jwtServices }) => jwtServices.SetTokenCookie(c, "AccessToken", AccessToken, 60 * 5)), Effect.andThen(() => c.json({ message: "Token refreshed successfully" })), Effect.catchTags({
            findRefreshTokenUserByTokenError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
            FindUserByIdError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
            ParseError: () => Effect.succeed(c.json({ message: "Paser data Error" }, 500)),
            SetCookieError: () => Effect.succeed(c.json({ message: "set cookie Error" }, 500)),
            SignTokenError: () => Effect.succeed(c.json({ message: "sign token Error" }, 500)),
        }), Effect.withSpan("POST /.refres-htoken.controller"));
        const result = await ServicesRuntime.runPromise(programs);
        return result;
    });
    return app;
}
