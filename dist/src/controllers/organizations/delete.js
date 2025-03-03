import { Effect } from "effect";
import * as S from "effect/Schema";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/effect";
import { ServicesRuntime } from "../../runtime/indext.js";
import { Branded, Helpers, OrganizationSchema } from "../../schema/index.js";
import { OrganizationServiceContext } from "../../services/organization/index.js";
import * as Errors from "../../types/error/ORG-errors.js";
const deleteUserResponseSchema = OrganizationSchema.Schema.omit("deletedAt");
const deleteUserDocs = describeRoute({
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: resolver(deleteUserResponseSchema),
                },
            },
            description: "Delete Organization By UserId",
        },
        500: {
            content: {
                "application/json": {
                    schema: resolver(S.Struct({
                        message: S.String,
                    })),
                },
            },
            description: "Delete Organization Error",
        },
    },
    tags: ["Organization"],
});
const validateDeleteUserRequest = validator("param", S.Struct({
    ORGId: Branded.OrganizationIdFromString,
}));
export function setupDeleteRoutes() {
    const app = new Hono();
    app.delete("/:ORGId", deleteUserDocs, validateDeleteUserRequest, async (c) => {
        const { ORGId } = c.req.valid("param");
        const parseResponse = Helpers.fromObjectToSchemaEffect(deleteUserResponseSchema);
        const program = OrganizationServiceContext.pipe(Effect.bind("deletedORG", OrganizationServiceContext => OrganizationServiceContext.findById(ORGId).pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(Errors.findORGByIdError.new(`Not found user Id: ${ORGId}`)())))), Effect.andThen(svc => svc.remove(ORGId)), Effect.andThen(parseResponse), Effect.andThen(data => c.json(data, 201)), Effect.catchTags({
            findORGByIdError: () => Effect.succeed(c.json({ message: `Not found Id: ${ORGId}` }, 404)),
            removeORGError: () => Effect.succeed(c.json({ message: "remove error" }, 500)),
        }), Effect.withSpan("DELETE /:employeeId.employee.controller"));
        const result = await ServicesRuntime.runPromise(program);
        return result;
    });
    return app;
}
