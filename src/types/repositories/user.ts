import type { Branded, UserSchema } from "../../schema/index.js"

type User = UserSchema.User
type UserArray = UserSchema.UserArray
export type UserWithoutId = Omit<User, "id">
export type UserLogin = Omit<User, "createdAt" | "updatedAt" | "deletedAt" | "_tag">
export type Username = Omit<User, "id" | "password" | "createdAt" | "updatedAt" | "deletedAt" | "_tag">
export type password = Omit<User, "id" | "username" | "createdAt" | "updatedAt" | "deletedAt" | "_tag">

export type CreateUsereDto = Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt" | "_tag">
export type UpdateUserDto = CreateUsereDto & {
  id?: User["id"]
}

export type UserRepository = {
  create: (data: CreateUsereDto) => Promise<User>
  findById: (id: Branded.UserId) => Promise<User | null>
  findMany: () => Promise<UserArray>
  update: (id: Branded.UserId, data: UpdateUserDto) => Promise<User | null>
  updatePartial: (id: Branded.UserId, data: Partial<UpdateUserDto>) => Promise<User | null>
  remove: (id: Branded.UserId) => Promise<User | null>
  hardRemove: (id: Branded.UserId) => Promise<User | null>
  findByUsername: (username: string) => Promise<User | null>
}
