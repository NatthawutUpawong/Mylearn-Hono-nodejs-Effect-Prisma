import { Hono } from "hono";
import * as GetRoutes from "./get.js";
import * as PostRoutes from "./post.js";
import * as PutRoutes from "./put.js";
export function setupUserRoutes() {
    const app = new Hono();
    app.route("/", GetRoutes.setupUserGetRoutes());
    app.route("/", PostRoutes.setupUserPostRoutes());
    app.route("/", PutRoutes.setupUserPutRoutes());
    return app;
}
