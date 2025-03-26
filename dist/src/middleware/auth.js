import { Effect } from "effect";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { ServicesRuntime } from "../runtime/indext.js";
import { JwtServiceContext } from "../services/jwt/indext.js";
import { RefreshTokenServiceContext } from "../services/refreshtoken/index.js";
import * as RefreshTokenErrors from "../types/error/refreshtoken-errors.js";
import * as Errors from "../types/error/user-errors.js";
export const authMiddleware = createMiddleware(async (c, next) => {
    const AccessToken = getCookie(c, "AccessToken");
    const RefreshToken = getCookie(c, "RefreshToken");
    const programs = Effect.all({
        JwtService: JwtServiceContext,
        refreshtokenservice: RefreshTokenServiceContext,
    }).pipe(Effect.bind("refreshtoken", ({ refreshtokenservice }) => refreshtokenservice.findByToken(RefreshToken).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(RefreshTokenErrors.findRefreshTokenByTokenError.new("Unauthorized")())))), Effect.bind("AccessToken", () => AccessToken && RefreshToken
        ? Effect.succeed(AccessToken)
        : Effect.fail(Errors.VerifyTokenError.new("Unauthorized")())), Effect.andThen(({ AccessToken, JwtService }) => JwtService.VerifyToken(AccessToken).pipe(Effect.catchTag("VerifyTokenError", () => Effect.fail(Errors.VerifyTokenError.new("Unauthorized")())))), Effect.tap((decoded) => {
        c.set("userPayload", decoded);
        return Effect.void;
    }), Effect.andThen(b => b), Effect.andThen(() => Effect.promise(next)), Effect.catchTags({
        findRefreshTokenUserByTokenError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
        VerifyTokenError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
    }));
    const result = await ServicesRuntime.runPromise(programs);
    return result;
});
