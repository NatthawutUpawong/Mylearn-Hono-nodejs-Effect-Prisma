// import { Effect } from "effect"
// import * as S from "effect/Schema"
// import { Hono } from "hono"
// import * as honoOpenapi from "hono-openapi"
// import { resolver, validator } from "hono-openapi/effect"
// import { ServicesRuntime } from "../../runtime/indext.js"
// import { Branded, Helpers, ProjectSchema } from "../../schema/index.js"
// import { ProjectServiceContext } from "../../services/project/index.js"
// import * as Errors from "../../types/error/project-errors.js"

// const responseSchema = ProjectSchema.Schema.omit("deletedAt")

// const putDocss = honoOpenapi.describeRoute({
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: resolver(responseSchema),
//         },
//       },
//       description: "Udate Project",
//     },
//     500: {
//       content: {
//         "application/json": {
//           schema: resolver(S.Struct({
//             message: S.String,
//           })),
//         },
//       },
//       description: "Udate Project Error",
//     },
//   },
//   tags: ["Project"],
// })

// const validateRequestBody = validator("json", ProjectSchema.UpdateSchema)
// const validateUpdateParam = validator("param", S.Struct({
//   projectId: Branded.ProjectIdFromString,
// }))

// export function setupProjectPutRoutes() {
//   const app = new Hono()

//   app.put("/:projectId", putDocss, validateRequestBody, validateUpdateParam, async (c) => {
//     const body = c.req.valid("json")
//     const { projectId } = c.req.valid("param")

//     const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

//     const programs = Effect.all({
//       ProjectService: ProjectServiceContext,
//     }).pipe(
//       Effect.tap(() => Effect.log("Update starting")),
//       Effect.andThen(b => b),
//       Effect.bind("existingProject", ({ ProjectService }) => ProjectService.findById(projectId).pipe(
//         Effect.catchTag("NoSuchElementException", () =>
//           Effect.fail(Errors.findProjectByIdError.new(`not found Id: ${projectId}`)())),
//       )),
//       Effect.andThen(b => b),
//       Effect.bind("newName", ({ existingProject }) =>
//         Effect.succeed(body.name.trim() === "" ? existingProject.name : body.name)),
//       Effect.andThen(b => b),
//       Effect.andThen(({ newName, ProjectService }) => ProjectService.update(projectId, { ...body, name: newName })),

//       Effect.andThen(parseResponse),
//       Effect.andThen(data => c.json(data, 201)),
//       Effect.catchTags({
//         findProjectByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
//         ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
//         updateProjectError: () => Effect.succeed(c.json({ message: "update failed" }, 500)),
//       }),
//       Effect.withSpan("PUT /.Project.controller"),
//     )

//     const result = await ServicesRuntime.runPromise(programs)
//     return result
//   })

//   return app
// }
