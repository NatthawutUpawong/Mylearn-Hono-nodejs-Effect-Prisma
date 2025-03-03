import { Effect } from "effect";
import { JwtServiceContext } from "../services/jwt/indext.js";
export function authMiddleware(c, next) {
    return Effect.sync(() => c.req.header("Authorization")).pipe(Effect.tap(authHeader => !authHeader || !authHeader.startsWith("Bearer ")
        ? Effect.fail({ error: "Unauthorized", status: 401 })
        : Effect.succeed(authHeader)), Effect.map(authHeader => authHeader.split(" ")[1]), Effect.andThen(token => Effect.tryPromise({
        catch: () => ({ error: "Invalid Token", status: 403 }),
        try: () => verify(token, process.env.JWT_SECRET),
    })), Effect.tap(decoded => Effect.sync(() => c.set("user", decoded))), Effect.andThen(() => Effect.promise(() => next())), Effect.catchAll(({ error, status }) => c.json({ error }, status)));
}
