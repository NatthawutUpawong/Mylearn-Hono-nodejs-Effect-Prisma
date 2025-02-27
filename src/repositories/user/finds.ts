import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "../../types/repositories/user.js"
import { Effect } from "effect"
import { Helpers, UserSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/user-errors.js"

export function findMany(prismaClient: PrismaClient): UserRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyUserError.new(),
    try: () => prismaClient.user.findMany({
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.tap(b => console.log(b)),
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.SchemaArray)),
    Effect.withSpan("find-many.user.repository"),
  )
}

export function findById(prismaClient: PrismaClient): UserRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.FindUserByIdError.new(),
    try: () => prismaClient.user.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
    Effect.withSpan("find-by-id.user.repository"),
  )
}

export function findallById(prismaClient: PrismaClient): UserRepository["findallById"] {
  return id => Effect.tryPromise({
    catch: Errors.FindUserByIdError.new(),
    try: () => prismaClient.user.findUnique({
      where: {
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
    Effect.withSpan("find-by-id.user.repository"),
  )
}

export function findByusername(prismaClient: PrismaClient): UserRepository["findByUsername"] {
  return username => Effect.tryPromise({
    catch: Errors.FindUserByUsernameError.new(),
    try: () => prismaClient.user.findUnique({
      where: {
        deletedAt: null,
        username,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
    Effect.withSpan("find-by-username.username.repository"),
  )
}
