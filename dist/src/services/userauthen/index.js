import { Effect, flow, Match } from "effect";
import * as UserErrors from "../../types/error/user-errors.js";
function userRoleCheck(userRole) {
    return userRole === "User";
}
const userRoleCheckEffect = flow(userRoleCheck, Match.type().pipe(Match.when(false, () => Effect.succeed(false)), Match.when(true, () => Effect.succeed(true)), Match.exhaustive));
function userIdCheck(userIdProjectRel, userIdPayload) {
    return userIdProjectRel === userIdPayload;
}
const userIdCheckEffect = flow(userIdCheck, Match.type().pipe(Match.when(false, () => Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access this project")())), Match.when(true, () => Effect.succeed(true)), Match.exhaustive));
function userORGCheck(userORGIdProjectRel, userORGIdPayload) {
    return userORGIdProjectRel === userORGIdPayload;
}
const userORGCheckEffect = flow(userORGCheck, Match.type().pipe(Match.when(false, () => Effect.fail(UserErrors.PermissionDeniedError.new("You do not have permission to access this project")())), Match.when(true, () => Effect.succeed(true)), Match.exhaustive));
export class UserroleCheckServiceContext extends Effect.Service()("service/UserPermission", {
    effect: Effect.Do.pipe(Effect.andThen(() => {
        return {
            userIdCheckEffect: (userIdProjectRel, userIdPayload) => userIdCheckEffect(userIdProjectRel, userIdPayload).pipe(Effect.withSpan("check.user-id-permission.service")),
            userORGCheckEffect: (userORGIdProjectRel, userORGIdPayload) => userORGCheckEffect(userORGIdProjectRel, userORGIdPayload).pipe(Effect.withSpan("check.user-ORGid-permission.service")),
            userRoleCheckEffect: (userRole) => userRoleCheckEffect(userRole).pipe(Effect.withSpan("check.user-role.service")),
        };
    })),
}) {
}
