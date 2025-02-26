import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"

export class createProjectRelationtError extends Data.TaggedError("createProjectRelationtError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findProjectRelationtByIdError extends Data.TaggedError("findProjectRelationtByIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class findManyProjectRelationtError extends Data.TaggedError("findManyProjectRelationtError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class updateProjectRelationtError extends Data.TaggedError("updateProjectRelationtError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class removeProjectRelationtError extends Data.TaggedError("removeProjectRelationtError")<ErrorMsg> {
  static new = createErrorFactory(this)
}
