import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"

export class UploadImageToMinioError extends Data.TaggedError("UploadImageToMinioError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class CreateMinioBucketError extends Data.TaggedError("CreateMinioBucketError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class ConvertFileToArrayBufferError extends Data.TaggedError("ConvertFileToArrayBufferError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class ConfigEnvError extends Data.TaggedError("ConfigEnvError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FileTypeError extends Data.TaggedError("FileTypeError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FileNameError extends Data.TaggedError("FileNameError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FileSizeError extends Data.TaggedError("FileSizeError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class DeleteFileError extends Data.TaggedError("DeleteFileError")<ErrorMsg> {
  static new = createErrorFactory(this)
}
