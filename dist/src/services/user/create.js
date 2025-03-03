// import { Effect } from "effect"
// import type { UserRepository } from "../../types/repositories/user.js"
// import type { UserService } from "../../types/services/user.js"
// import * as Errors from "../../types/error/user-errors.js"
// import { UserRepositoryContext } from "../../repositories/user/index.js"
export {};
// export function create(userRepository: UserRepository): UserService["create"] {
//   return data => Effect.tryPromise({
//     catch: Errors.CreateUserError.new(),
//     try: () => UserRepositoryContext.create(data).pipe(
//       Effect.withSpan("create.user.service")
//     )
//   })
//   //   const hashedPassword = await argon2.hash(data.password)
//   //   const employee = await userRepository.create({
//   //     ...data,
//   //     password: hashedPassword,
//   //   })
//   //   return employee
// // }
