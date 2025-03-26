import { config } from "@dotenvx/dotenvx";
import { Effect } from "effect";
import { setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import * as Errors from "../../types/error/user-errors.js";
config();
// eslint-disable-next-line node/prefer-global/process
const secretKey = process.env.SECRET_KEY ?? "default_secret";
function SignTokenWihtPayload(data) {
    return Effect.try({
        catch: Errors.SignTokenError.new(),
        try: () => jwt.sign(data, secretKey, { algorithm: "HS256", expiresIn: "5m" }),
    });
}
function SignToken() {
    return Effect.try({
        catch: Errors.SignTokenError.new(),
        try: () => jwt.sign({}, secretKey, { algorithm: "HS256", expiresIn: "7d" }),
    });
}
function VerifyToken(token) {
    return Effect.try({
        catch: Errors.VerifyTokenError.new(),
        try: () => jwt.verify(token, secretKey),
    });
}
function SetTokenCookie(c, name, token, age) {
    return Effect.try({
        catch: Errors.SetCookieError.new(),
        try: () => setCookie(c, name, token, {
            httpOnly: true,
            maxAge: age,
            sameSite: "Strict",
            secure: true,
        }),
    });
}
export class JwtServiceContext extends Effect.Service()("service/Jwt", {
    effect: Effect.Do.pipe(Effect.andThen(() => {
        return {
            SetTokenCookie: (c, name, token, age) => SetTokenCookie(c, name, token, age).pipe(Effect.withSpan("SetCookie.user.service")),
            SignToken: () => SignToken().pipe(Effect.withSpan("signtoken.user.service")),
            SignTokenWihtPayload: (data) => SignTokenWihtPayload(data).pipe(Effect.withSpan("SignTokenWihtPayload.user.service")),
            VerifyToken: (token) => VerifyToken(token).pipe(Effect.withSpan("verifytoken.user.service")),
        };
    })),
}) {
}
