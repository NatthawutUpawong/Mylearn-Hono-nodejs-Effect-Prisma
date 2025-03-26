import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { authMiddleware } from "../../middleware/auth.js"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Branded, Helpers, UserSchema } from "../../schema/index.js"
import { OrganizationServiceContext } from "../../services/organization/index.js"
import { PasswordServiceContext } from "../../services/password/indext.js"
import { ProjectRelationServiceContext } from "../../services/projectRelation/index.js"
import { RefreshTokenServiceContext } from "../../services/refreshtoken/index.js"
import { UserServiceContext } from "../../services/user/index.js"
import * as ORGErrors from "../../types/error/ORG-errors.js"
import * as UserErrors from "../../types/error/user-errors.js"

const updateUserByAdminResponseSchema = UserSchema.UpdateByAdminSchema

const updateByAdminDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(updateUserByAdminResponseSchema),
        },
      },
      description: "Udate User",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(updateUserByAdminResponseSchema),
        },
      },
      description: "Update User Error",
    },
  },
  tags: ["Admin-User"],
})

const validateUpdateUserByAdminRequest = validator("json", UserSchema.UpdateByAdminSchema)
const validateUpdateUserParam = validator("param", S.Struct({
  userId: Branded.UserIdFromString,
}))

export function setupUserPutRoutes() {
  const app = new Hono()

  app.put("/:userId", authMiddleware, updateByAdminDocs, validateUpdateUserByAdminRequest, validateUpdateUserParam, async (c) => {
    const body = c.req.valid("json")
    const { userId } = c.req.valid("param")
    const getUserPayload: UserSchema.UserPayload = c.get("userPayload")

    const parseResponse = Helpers.fromObjectToSchemaEffect(updateUserByAdminResponseSchema)

    const programs = Effect.all({
      ORGService: OrganizationServiceContext,
      passwordService: PasswordServiceContext,
      projectRelationService: ProjectRelationServiceContext,
      refreshtokenService: RefreshTokenServiceContext,
      userServices: UserServiceContext,
    })
      .pipe(
        Effect.tap(() =>
          getUserPayload.role === "User_Admin"
            ? Effect.void
            : Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access")()),
        ),

        Effect.tap(() => Effect.log("Update starting")),

        Effect.tap(({ ORGService }) =>
          body.organizationId === null
            ? Effect.void
            : ORGService.findById(body.organizationId).pipe(
                Effect.catchTag("NoSuchElementException", () =>
                  Effect.fail(ORGErrors.findORGByIdError.new(`ORG Id: ${body.organizationId} nofound`)())),
              ),
        ),
        Effect.bind("existingUser", ({ userServices }) =>
          userServices.findOneById(userId).pipe(
            Effect.catchTag("NoSuchElementException", () =>
              Effect.fail(UserErrors.FindUserByIdError.new(`Id not found: ${userId}`)())),
          )),

        Effect.tap(({ existingUser }) =>
          body.id === existingUser.id
            ? Effect.void
            : Effect.fail(UserErrors.UserIdMatchError.new("Id from param and body id not match")()),
        ),
        Effect.bind("updateUser", ({ projectRelationService, userServices }) =>
          userServices.updateByAdmin(userId, body).pipe(
            Effect.tap(result => projectRelationService.update(result.id, ({ organizationId: result.organizationId }))),
            Effect.andThen(parseResponse),
          )),
        Effect.tap(({ refreshtokenService, updateUser }) => refreshtokenService.findByUserId(updateUser.id).pipe(
          Effect.catchTag("NoSuchElementException", () => Effect.void),
          Effect.andThen(token =>
            !token
              ? Effect.void
              : refreshtokenService.hardRemoveByUserId(token.userId),
          ),
        )),
        Effect.andThen(data => c.json(data.updateUser, 200)),

        Effect.catchTags({
          findORGByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
          findRefreshTokenByUserIdError: () => Effect.succeed(c.json({ message: "Find refresh Error" }, 500)),
          FindUserByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
          ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
          PermissionDeniedError: e => Effect.succeed(c.json({ message: e.msg }, 401)),
          removeRefreshTokenError: () => Effect.succeed(c.json({ messgae: "User updated successfully but remove Refreshtoken Error" }, 500)),
          updateProjectRelationtError: () => Effect.succeed(c.json({ message: "Update projectrelation Error" }, 500)),
          UserIdMatchError: e => Effect.succeed(c.json({ message: e.msg }, 400)),
        }),

        Effect.withSpan("PUT /user-by-admin.controller"),
      )
    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
