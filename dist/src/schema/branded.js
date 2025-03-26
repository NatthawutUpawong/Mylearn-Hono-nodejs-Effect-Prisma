/* eslint-disable ts/no-redeclare */
import * as S from "effect/Schema";
export const UserId = S.Number.pipe(S.brand("UserId")).annotations({ jsonSchema: { type: "number" } });
export const UserIdFromString = S.transform(S.NumberFromString, UserId, {
    decode: id => UserId.make(id),
    encode: id => id,
});
export const OrganizationId = S.Number.pipe(S.brand("OrganizationId")).annotations({ jsonSchema: { type: "number" } });
export const OrganizationIdFromString = S.transform(S.NumberFromString, OrganizationId, {
    decode: id => OrganizationId.make(id),
    encode: id => id,
});
export const ProjectId = S.Number.pipe(S.brand("ProjectId")).annotations({ jsonSchema: { type: "number" } });
export const ProjectIdFromString = S.transform(S.NumberFromString, ProjectId, {
    decode: id => ProjectId.make(id),
    encode: id => id,
});
export const ProjectRelationId = S.Number.pipe(S.brand("ProjectRelationId")).annotations({ jsonSchema: { type: "number" } });
export const ProjectRelationIdFromString = S.transform(S.NumberFromString, ProjectRelationId, {
    decode: id => ProjectRelationId.make(id),
    encode: id => id,
});
export const RefreshTokenId = S.Number.pipe(S.brand("RefreshTokenId")).annotations({ jsonSchema: { type: "number" } });
export const RefreshTokenIdFromString = S.transform(S.NumberFromString, RefreshTokenId, {
    decode: id => RefreshTokenId.make(id),
    encode: id => id,
});
export const UsernameType = S.String.pipe(S.brand("UsernameType")).annotations({ jsonSchema: { type: "string" } });
