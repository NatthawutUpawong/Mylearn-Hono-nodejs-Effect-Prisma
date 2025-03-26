import { openAPISpecs } from "hono-openapi";
import packageJson from "../../../package.json" with { type: "json" };
export function setupOpenApi(app) {
    app.get("/openapi.json", openAPISpecs(app, {
        documentation: {
            "info": {
                description: "API for greeting users",
                title: "Hono",
                version: packageJson.version,
            },
            "servers": [
                {
                    description: "Local server",
                    url: "http://localhost:3000",
                },
                {
                    description: "Prod server",
                    url: "https://api.app.com",
                },
            ],
            "x-tagGroups": [
                {
                    name: "General User",
                    tags: ["User", "Organization", "Project", "RefreshToken"],
                },
                {
                    name: "Admin",
                    tags: ["Admin-User", "Admin-Organization", "Admin-Project", "Admin-RefreshToken"],
                },
            ],
        },
    }));
    return app;
}
