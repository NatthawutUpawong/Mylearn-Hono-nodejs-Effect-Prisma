import { Hono } from "hono";
import * as DeleteRoutes from "./delete.js";
import * as GetRoutes from "./get.js";
export function setupRefreshTokenByAdminRoutes() {
    const app = new Hono();
    app.route("/", GetRoutes.setupRefreshtokenGetRoutes());
    app.route("/", DeleteRoutes.setupDeleteRoutes());
    return app;
}
