import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"


export class createProjectError extends Data.TaggedError("createProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findProjectByIdError extends Data.TaggedError("findProjectByIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findManyProjectError extends Data.TaggedError("findManyProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class updateProjectError extends Data.TaggedError("updateProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class removeProjectError extends Data.TaggedError("removeProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}


