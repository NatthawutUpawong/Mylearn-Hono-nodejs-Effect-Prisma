import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"

export class createRefreshTokenError extends Data.TaggedError("createRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findRefreshTokenByUserIdError extends Data.TaggedError("findRefreshTokenByUserIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}
export class findRefreshTokenByTokenIdError extends Data.TaggedError("findRefreshTokenByTokenIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findManyRefreshTokenError extends Data.TaggedError("findManyRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findRefreshTokenByTokenError extends Data.TaggedError("findRefreshTokenUserByTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class updateRefreshTokenError extends Data.TaggedError("updateRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class removeRefreshTokenError extends Data.TaggedError("removeRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class countRefreshTokenError extends Data.TaggedError("countRefreshTokenError")<ErrorMsg> {
  static new = createErrorFactory(this)
}
