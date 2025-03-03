import { config } from "@dotenvx/dotenvx";
import { Effect } from "effect";
import jwt from "jsonwebtoken";
import * as Errors from "../../types/error/user-errors.js";
config();
// eslint-disable-next-line node/prefer-global/process
const secretKey = process.env.SECRET_KEY;
console.log("SECRET_KEY:", process.env.SECRET_KEY);
// function SignToken(data: object): Effect.Effect<string, Errors.SignTokenError> {
//   return Effect.try({
//     catch: Errors.SignTokenError.new(),
//     try: () => jwt.sign(data, secretKey, { expiresIn: "1h" }),
//   })
// }
// function VerifyToken(token: string): Effect.Effect<string | jwt.JwtPayload, Errors.VerifyTokenError> {
//     return Effect.try({
//       catch: Errors.VerifyTokenError.new(),
//       try: () => jwt.verify(token, secretKey),
//     })
//   }
// export class JwtServiceContext extends Effect.Service<JwtServiceContext>()("service/Jwt", {
//   effect: Effect.Do.pipe(
//     Effect.andThen(() => {
//       return {
//         SignToken: (data: object) => SignToken(data).pipe(
//           Effect.withSpan("signtoken.user.service"),
//         ),
//         VerifyToken: (token: string) => VerifyToken(token).pipe(
//           Effect.withSpan("verifytoken.user.service"),
//         ),
//       }
//     }),
//   ),
// }) {}
