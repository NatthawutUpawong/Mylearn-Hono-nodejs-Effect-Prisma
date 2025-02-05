import type { Branded, UserSchema } from "../../schema/index.js"

export type UserService = {
  create: (data: UserSchema.CreateUser) => Promise<UserSchema.User>
  findMany: () => Promise<UserSchema.UserArray>
  findOneById: (id: Branded.UserId) => Promise<UserSchema.User | null>
  update: (id: Branded.UserId, data: UserSchema.UpdateUser) => Promise<UserSchema.User | null>
  removeById: (id: Branded.UserId) => Promise<UserSchema.User | null>
}
