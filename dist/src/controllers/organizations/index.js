import { Hono } from "hono";
// import * as GetRoutes from "./get.js"
export function setupOrganizationRoutes() {
    const app = new Hono();
    // app.route("/", GetRoutes.setupORGGetRoutes())
    return app;
}
