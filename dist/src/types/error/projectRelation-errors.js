import { Data } from "effect";
import { createErrorFactory } from "../error.helpers.js";
export class createProjectRelationtError extends Data.TaggedError("createProjectRelationtError") {
    static new = createErrorFactory(this);
}
export class findProjectRelationtByIdError extends Data.TaggedError("findProjectRelationtByIdError") {
    static new = createErrorFactory(this);
}
export class findManyProjectRelationtError extends Data.TaggedError("findManyProjectRelationtError") {
    static new = createErrorFactory(this);
}
export class updateProjectRelationtError extends Data.TaggedError("updateProjectRelationtError") {
    static new = createErrorFactory(this);
}
export class removeProjectRelationtError extends Data.TaggedError("removeProjectRelationtError") {
    static new = createErrorFactory(this);
}
export class accessProjectRelationError extends Data.TaggedError("accessProjectRelationError") {
    static new = createErrorFactory(this);
}
