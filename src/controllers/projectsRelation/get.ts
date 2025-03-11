// import { Effect } from "effect"
// import * as S from "effect/Schema"
// import { Hono } from "hono"
// import { describeRoute } from "hono-openapi"
// import { resolver, validator } from "hono-openapi/effect"
// import { ServicesRuntime } from "../../runtime/indext.js"
// import { Branded, Helpers, ProjectRelationsWithRelationsSchema } from "../../schema/index.js"
// import { ProjectRelationServiceContext } from "../../services/projectRelation/index.js"
// // import * as Errors from "../../types/error/ORG-errors.js"

// export function setupProjectRelationGetRoutes() {
//   const app = new Hono()

//   const getManyResponseSchema = S.Array(ProjectRelationsWithRelationsSchema.Schema.omit("deletedAt"))

//   const getManyDocs = describeRoute({
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: resolver(getManyResponseSchema),
//           },
//         },
//         description: "Get ProjectRelation",
//       },
//       500: {
//         content: {
//           "application/json": {
//             schema: resolver(S.Struct({
//               message: S.String,
//             })),
//           },
//         },
//         description: "Get Many ProjectRelation Error",
//       },
//     },

//     tags: ["ProjectRelation"],
//   })

//   app.get("/", getManyDocs, async (c) => {
//     const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

//     const program = ProjectRelationServiceContext.pipe(
//       Effect.tap(() => Effect.log("start finding many Project")),
//       Effect.andThen(svc => svc.findMany()),

//       Effect.andThen(parseResponse),

//       Effect.andThen(data => c.json(data, 200)),
//       Effect.tap(() => Effect.log("test")),
//       Effect.catchTags({
//         findManyProjectRelationtError: () => Effect.succeed(c.json({ message: "find many error" }, 500)),
//         ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
//       }),
//       Effect.annotateLogs({ key: "annotate" }),
//       Effect.withLogSpan("test"),
//       Effect.withSpan("GET /.Project.controller /"),
//     )

//     const result = await ServicesRuntime.runPromise(program)
//     return result
//   })

//   // const getByIdResponseSchema = ProjectWithRelationsSchema.Schema.omit("deletedAt")

//   // const getByIdDocs = describeRoute({
//   //   responses: {
//   //     200: {
//   //       content: {
//   //         "application/json": {
//   //           schema: resolver(getByIdResponseSchema),
//   //         },
//   //       },
//   //       description: "Get Project by Id",
//   //     },
//   //     404: {
//   //       content: {
//   //         "application/json": {
//   //           schema: resolver(S.Struct({
//   //             message: S.String,
//   //           })),
//   //         },
//   //       },
//   //       description: "Get Project By Id Not Found",
//   //     },
//   //   },
//   //   tags: ["Project"],
//   // })

//   // const validateProjectRequest = validator("param", S.Struct({
//   //   projectId: Branded.ProjectIdFromString,
//   // }))

//   // app.get("/:projectId", getByIdDocs, validateProjectRequest, async (c) => {
//   //   const { projectId } = c.req.valid("param")
//   //   const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

//   //   const program = ProjectServiceContext.pipe(
//   //     Effect.tap(() => Effect.log("start finding by Id Project")),
//   //     Effect.andThen(svc => svc.findById(projectId)),
//   //     Effect.andThen(parseResponse),
//   //     Effect.andThen(data => c.json(data, 200)),
//   //     Effect.andThen(b => b),
//   //     Effect.catchTags({
//   //       findProjectByIdError: () => Effect.succeed(c.json({ message: "find by Id Error" }, 500)),
//   //       NoSuchElementException: () => Effect.succeed(c.json({ message: `not found Id: ${projectId}` }, 404)),
//   //       ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
//   //     }),
//   //     Effect.annotateLogs({ key: "annotate" }),
//   //     Effect.withLogSpan("test"),
//   //     Effect.withSpan("GET /userId.Project.controller /"),
//   //   )
//   //   const result = await ServicesRuntime.runPromise(program)
//   //   return result
//   // })
//   return app
// }
