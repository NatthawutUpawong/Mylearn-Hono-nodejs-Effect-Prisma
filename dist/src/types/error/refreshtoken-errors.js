import { Data } from "effect";
import { createErrorFactory } from "../error.helpers.js";
export class createRefreshTokenError extends Data.TaggedError("createRefreshTokenError") {
    static new = createErrorFactory(this);
}
export class findRefreshTokenByUserIdError extends Data.TaggedError("findRefreshTokenByUserIdError") {
    static new = createErrorFactory(this);
}
export class findRefreshTokenByTokenIdError extends Data.TaggedError("findRefreshTokenByTokenIdError") {
    static new = createErrorFactory(this);
}
export class findManyRefreshTokenError extends Data.TaggedError("findManyRefreshTokenError") {
    static new = createErrorFactory(this);
}
export class findRefreshTokenByTokenError extends Data.TaggedError("findRefreshTokenUserByTokenError") {
    static new = createErrorFactory(this);
}
export class updateRefreshTokenError extends Data.TaggedError("updateRefreshTokenError") {
    static new = createErrorFactory(this);
}
export class removeRefreshTokenError extends Data.TaggedError("removeRefreshTokenError") {
    static new = createErrorFactory(this);
}
export class countRefreshTokenError extends Data.TaggedError("countRefreshTokenError") {
    static new = createErrorFactory(this);
}
