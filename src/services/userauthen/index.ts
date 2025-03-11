import type { UserSchema } from "../../schema/index.js"
import { Effect, flow, Match } from "effect"
import * as UserErrors from "../../types/error/user-errors.js"

function userRoleCheck(userRole: UserSchema.User["role"]): boolean {
  return userRole === "User"
}

const userRoleCheckEffect = flow(
  userRoleCheck,
  Match.type<boolean>().pipe(
    Match.when(false, () => Effect.succeed(false)),
    Match.when(true, () => Effect.succeed(true)),
    Match.exhaustive,
  ),
)

function userIdCheck(userIdProjectRel: UserSchema.User["id"], userIdPayload: UserSchema.User["id"]): boolean {
  return userIdProjectRel === userIdPayload
}

const userIdCheckEffect = flow(
  userIdCheck,
  Match.type<boolean>().pipe(
    Match.when(false, () => Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access this project")())),
    Match.when(true, () => Effect.succeed(true)),
    Match.exhaustive,
  ),
)

function userORGCheck(userORGIdProjectRel: UserSchema.User["organizationId"], userORGIdPayload: UserSchema.User["organizationId"]): boolean {
  return userORGIdProjectRel === userORGIdPayload
}

const userORGCheckEffect = flow(
  userORGCheck,
  Match.type<boolean>().pipe(
    Match.when(false, () => Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access this project")())),
    Match.when(true, () => Effect.succeed(true)),
    Match.exhaustive,
  ),
)

export class UserroleCheckServiceContext extends Effect.Service<UserroleCheckServiceContext>() ("service/UserPermission", {
  effect: Effect.Do.pipe(
    Effect.andThen(() => {
      return {
        userIdCheckEffect: (userIdProjectRel: UserSchema.User["id"], userIdPayload: UserSchema.User["id"]) => userIdCheckEffect(userIdProjectRel, userIdPayload).pipe(
          Effect.withSpan("check.user-id-permission.service"),
        ),
        userORGCheckEffect: (userORGIdProjectRel: UserSchema.User["organizationId"], userORGIdPayload: UserSchema.User["organizationId"]) => userORGCheckEffect(userORGIdProjectRel, userORGIdPayload).pipe(
          Effect.withSpan("check.user-ORGid-permission.service"),
        ),
        userRoleCheckEffect: (userRole: UserSchema.User["role"]) => userRoleCheckEffect(userRole).pipe(
          Effect.withSpan("check.user-role.service"),
        ),
      }
    }),
  ),
}) {}
