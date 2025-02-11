// import type { UserRepository } from "../../types/repositories/user.js"
// import type { UserService } from "../../types/services/user.js"
// import argon2 from "argon2"

// export function update(userRepository: UserRepository): UserService["update"] {
//   return async (id, data) => {
//     const existingPass = await userRepository.findById(id)
//     if (data.password !== "") {
//       const updatePassword = await argon2.hash(data.password)
//       data = { ...data, password: updatePassword}
//     }else {
//       data = { ...data, password: `${existingPass?.password}` }
//     }
    
//     return userRepository.update(id, data)
//   }
// }
