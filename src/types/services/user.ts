import type { Branded, UserSchema } from "../../schema/index.js"

export type UserService = {
  create: (data: UserSchema.CreateUser) => Promise<UserSchema.User>
  findMany: () => Promise<UserSchema.UserArray>
  findOneById: (id: Branded.UserId) => Promise<UserSchema.User | null>
  findByUsername: (username: string) => Promise<UserSchema.User | null>
  update: (id: Branded.UserId, data: UserSchema.UpdateUser) => Promise<UserSchema.User | null>
  removeById: (id: Branded.UserId) => Promise<UserSchema.User | null>
  login: (username:string, data: UserSchema.LoginUser) => Promise<UserSchema.User | { token: string }>
  getUserFromSession: (token: string) => Promise<UserSchema.User | null>
}
