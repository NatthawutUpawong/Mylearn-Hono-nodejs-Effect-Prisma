import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Helpers, UserSchema } from "../../schema/index.js"
import { MinioServiceContext } from "../../services/minio/index.js"
import { UserServiceContext } from "../../services/user/index.js"

const responseSchema = UserSchema.UpdateImageByUserSchema

const putDocs = honoOpenapi.describeRoute({
  responses: {
    201: {
      content: {
        "application/json": {
          schema: resolver(
            S.Struct({
              message: S.Literal("Upload successfully"),
            }),
          ),
        },
      },
      description: "Upload Image",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Upload Image Error",
    },
  },
  tags: ["Images"],
})

const validateCreateRequestFile = validator(
  "form",
  S.Struct({
    upload_image: S.Any,
  }),
)

export function setupImagesPutRoutes() {
  const app = new Hono()

  app.put("/", putDocs, authMiddleware, validateCreateRequestFile, async (c) => {
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const form = c.req.valid("form")

    // const body = c.req.valid("json")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const program = Effect.all({
      minioService: MinioServiceContext,
      UserService: UserServiceContext,

    }).pipe(
      Effect.bind("UserInfo", ({ UserService }) => UserService.findOneById(getUserPayload.id)),
      Effect.bind("MinioResponse", ({ minioService }) => minioService.uploadImageFile(form.upload_image)),
      Effect.bind("UpdateResponse", ({ MinioResponse, UserService }) =>
        UserService.updatePartial(getUserPayload.id, {
          profileImageName: MinioResponse.name,
          profileImageURL: MinioResponse.path,

        })),

      Effect.tap(({ minioService, UserInfo }) => minioService.deleteFile(UserInfo.profileImageName)),

      Effect.andThen(data => data.UpdateResponse),

      Effect.andThen(parseResponse),

      Effect.andThen(() => c.json("Upload successfully", 200)),

      Effect.catchTags({
        FileNameError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        FileSizeError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        FileTypeError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        FindUserByIdError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "Parse error" }, 500)),
        UpdateUserErroe: e => Effect.succeed(c.json({ message: e.msg }, 500)),
      }),
      Effect.withSpan("PUT /.image.controller"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  return app
}
