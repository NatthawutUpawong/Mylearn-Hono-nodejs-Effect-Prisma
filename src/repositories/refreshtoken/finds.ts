import type { PrismaClient } from "@prisma/client"
import type { RefreshTokenRepository } from "../../types/repositories/refreshtoken.js"
import { Effect } from "effect"
import { Helpers, RefreshTokenSchema, RefreshTokenWithRelationSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/refreshtoken-errors.js"

export function findByUserId(prismaClient: PrismaClient): RefreshTokenRepository["findByUserId"] {
  return userId => Effect.tryPromise({
    catch: Errors.findRefreshTokenByUserIdError.new(),
    try: () => prismaClient.refreshtokens.findUnique({
      where: {
        deletedAt: null,
        userId,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("find-by-id.refreshtoken.repository"),
  )
}
export function findByToken(prismaClient: PrismaClient): RefreshTokenRepository["findByToken"] {
  return token => Effect.tryPromise({
    catch: Errors.findRefreshTokenByTokenError.new(),
    try: () => prismaClient.refreshtokens.findUnique({
      where: {
        deletedAt: null,
        token,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenSchema.Schema)),
    Effect.withSpan("find-by-id.refreshtoken.repository"),
  )
}

export function finManyWithRelation(prismaClient: PrismaClient): RefreshTokenRepository["finManyWithRelation"] {
  return () => Effect.tryPromise({
    catch: Errors.findManyRefreshTokenError.new(),
    try: () => prismaClient.refreshtokens.findMany({
      include: {
        user: {
          where: {
            deletedAt: null,
          },
        },
      },
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    // Effect.tap(b => console.log(b)),
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenWithRelationSchema.SchemaArray)),
    Effect.withSpan("find-many.refreshtoken.repository"),
  )
}

export function findManyPagination(prismaClient: PrismaClient): RefreshTokenRepository["findManyPagination"] {
  return (limit: number, offset: number) => Effect.tryPromise({
    catch: Errors.findManyRefreshTokenError.new(),
    try: () => prismaClient.refreshtokens.findMany({
      include: {
        user: {
          where: {
            deletedAt: null,
          },
        },
      },
      skip: offset,
      take: limit,
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(RefreshTokenWithRelationSchema.SchemaArray)),
    Effect.withSpan("find-many-pagination.refreshtoken.repository"),
  )
}
