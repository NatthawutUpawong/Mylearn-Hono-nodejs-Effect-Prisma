import { Hono } from "hono";
import * as GetRoutes from "./get.js";
import * as PostRoutes from "./post.js";
import * as PutRoutes from "./put.js";
export function setupProjectRoutes() {
    const app = new Hono();
    app.route("/", GetRoutes.setupProjectGetRoutes());
    app.route("/", PostRoutes.setupProjectPostRoutes());
    app.route("/", PutRoutes.setupProjectPutRoutes());
    return app;
}
