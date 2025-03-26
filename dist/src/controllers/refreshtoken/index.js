import { Hono } from "hono";
import * as PostRoutes from "./post.js";
export function setupRefreshTokenRoutes() {
    const app = new Hono();
    app.route("/", PostRoutes.setupRefreshTokenGetRoutes());
    return app;
}
