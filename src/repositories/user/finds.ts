import type { PrismaClient } from "@prisma/client";
import type { UserRepository } from "../../types/repositories/user.js";
import { Helpers, UserSchema } from "../../schema/index.js";

export function findMany(
  prismaClient: PrismaClient
): UserRepository["findMany"] {
  return async () => {
    const result = await prismaClient.user.findMany({
      where: {
        deletedAt: null,
      },
    });
    const data = Helpers.fromObjectToSchema(UserSchema.SchemaArray)(result);
    return data;
  };
}

export function findById(
  prismaClient: PrismaClient
): UserRepository["findById"] {
  return async (id) => {
    const result = await prismaClient.user.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    });
    if (result === null) {
      return null;
    }
    return Helpers.fromObjectToSchema(UserSchema.Schema)(result);
  };
}

export function findByusername(
  prismaClient: PrismaClient
): UserRepository["findByUsername"] {
  return async (username) => {
    const result = await prismaClient.user.findUnique({
      where: {
        deletedAt: null,
        username,
      },
    });
    if (result === null) {
      return null;
    }
    return Helpers.fromObjectToSchema(UserSchema.Schema)(result);
  };
}
