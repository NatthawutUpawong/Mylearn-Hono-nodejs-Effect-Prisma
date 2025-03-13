import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"

export class createRefreshTokenError extends Data.TaggedError("createRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findRefreshTokenUserByIdError extends Data.TaggedError("findRefreshTokenUserByIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class updateRefreshTokenError extends Data.TaggedError("updateRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class removeRefreshTokenError extends Data.TaggedError("removeRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}
