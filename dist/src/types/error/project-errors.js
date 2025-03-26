import { Data } from "effect";
import { createErrorFactory } from "../error.helpers.js";
export class createProjectError extends Data.TaggedError("createProjectError") {
    static new = createErrorFactory(this);
}
export class findProjectByIdError extends Data.TaggedError("findProjectByIdError") {
    static new = createErrorFactory(this);
}
export class findManyProjectError extends Data.TaggedError("findManyProjectError") {
    static new = createErrorFactory(this);
}
export class updateProjectError extends Data.TaggedError("updateProjectError") {
    static new = createErrorFactory(this);
}
export class removeProjectError extends Data.TaggedError("removeProjectError") {
    static new = createErrorFactory(this);
}
export class accessProjectError extends Data.TaggedError("accessProjectError") {
    static new = createErrorFactory(this);
}
export class ProjectIdAlreadyExitError extends Data.TaggedError("ProjectIdAlreadyExitError") {
    static new = createErrorFactory(this);
}
export class ProjectIdNotMatchError extends Data.TaggedError("ProjectIdNotMatchError") {
    static new = createErrorFactory(this);
}
