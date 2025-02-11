import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { Helpers, UserSchema } from "../../schema/index.js"
import { UserServiceContext } from "../../services/user/index.js"
import { Effect,} from "effect"
import {ServicesRuntime} from "../../runtime/indext.js"
import {PasswordServiceContext} from "../../services/password/hashpassword.js"
import * as Errors from "../../types/error/user-errors.js"

const responseSchema = UserSchema.Schema.omit("deletedAt")

const postDocs = honoOpenapi.describeRoute({
  responses: {
    201: {
      content: {
        "application/json": {
          schema: resolver(responseSchema),
        },
      },
      description: "Create User",
    },
  },
  tags: ["User"],
})

const validateRequestBody = validator("json", UserSchema.CreateSchema)

export function setupUserPostRoutes() {
  const app = new Hono()

  app.post("/", postDocs, validateRequestBody, async (c) => {
    const body = c.req.valid("json")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      passwordService: PasswordServiceContext,
      userServices: UserServiceContext,
    }).pipe(
      Effect.tap(() => Effect.log("Signup starting")),
      Effect.tap(({userServices}) => userServices.findByUsername(body.username).pipe(
        Effect.andThen(() => 
        Effect.fail(Errors.UsernameAlreadyExitError.new("username alredy exit")()),
        ),
        Effect.catchTag("NoSuchElementException", () => Effect.void), 

      )),
      Effect.bind("hashedPassword", ({passwordService}) => passwordService.hashedPassword(body.password)),
      Effect.andThen(({hashedPassword, userServices}) => userServices.create({...body, password: hashedPassword}),
      ),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.orElseSucceed(() => c.json({message: "create failed"}, 500)),
      Effect.withSpan("POST /.user.controller"),
    )

    
    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
