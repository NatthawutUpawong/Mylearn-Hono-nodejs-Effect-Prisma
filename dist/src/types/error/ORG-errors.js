import { Data } from "effect";
import { createErrorFactory } from "../error.helpers.js";
export class createORGError extends Data.TaggedError("createORGError") {
    static new = createErrorFactory(this);
}
export class findORGByIdError extends Data.TaggedError("findORGByIdError") {
    static new = createErrorFactory(this);
}
export class findManyORGError extends Data.TaggedError("findManyORGError") {
    static new = createErrorFactory(this);
}
export class updateORGError extends Data.TaggedError("updateORGError") {
    static new = createErrorFactory(this);
}
export class removeORGError extends Data.TaggedError("removeORGError") {
    static new = createErrorFactory(this);
}
