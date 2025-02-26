import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"


export class createORGError extends Data.TaggedError("createORGError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findORGByIdError extends Data.TaggedError("findORGByIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findManyORGError extends Data.TaggedError("findManyORGError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class updateORGError extends Data.TaggedError("updateORGError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class removeORGError extends Data.TaggedError("removeORGError")<ErrorMsg> {
  static new = createErrorFactory(this)
}


