import type { UserSchema } from "../../schema/index.js"
import { Duration, Effect, pipe, Schedule } from "effect"
import { getMinIOClient } from "../../config/minio/setup-minio.js"
import { showErrorLog } from "../../helper/show_error_log.js"
import { MinioErrors } from "../../types/error/index.js"

// function createBucket(bucket_name: string) {
//   return Effect.Do.pipe(
//     Effect.bind("minioClient", () => getMinIOClient),
//     Effect.andThen(({ minioClient }) =>
//       Effect.tryPromise({
//         catch: (err) => {
//           return MinioErrors.CreateMinioBucketError.new("Create minio bucket error.")(err)
//         },
//         try: () => minioClient.makeBucket(bucket_name),
//       }),
//     ),
//   )
// }

function convertFileToArrayBuffer(file: File) {
  return Effect.tryPromise({
    catch: (err) => {
      showErrorLog("convert-file-to-array-buffer.minio.services:")(err)
      return MinioErrors.ConvertFileToArrayBufferError.new("Convert file error.")()
    },
    try: () => file.arrayBuffer(),
  })
}

const bucket_name = "users-images-profile"

export function uploadImageFile(file: File) {
  // const bucket_name = "zerocarbon"
  const file_size = file.size
  const max_size = 2 * 1024 * 1024 // 2MB

  const timestamp = Date.now()
  const extension = file.name.split(".").pop()
  const baseName = file.name.split(".").slice(0, -1).join(".")
  const file_name = `${baseName}_${timestamp}.${extension}`

  return Effect.Do.pipe(
    Effect.tap(() => {
      if (!(file instanceof File)) {
        return Effect.fail(MinioErrors.FileTypeError.new("File image error.")())
      }

      if (!file.type.startsWith("image/")) {
        return Effect.fail(MinioErrors.FileTypeError.new("Only image files are allowed.")())
      }

      if (file_size > max_size) {
        return Effect.fail(MinioErrors.FileSizeError.new("Image file must be under 2MB.")())
      }

      return Effect.succeed(true)
    }),
    Effect.bind("minioClient", () => getMinIOClient),
    Effect.bind("arrayBuffer", () => convertFileToArrayBuffer(file)),
    Effect.andThen(({ arrayBuffer, minioClient }) =>
      Effect.tryPromise({
        catch: (err) => {
          showErrorLog("upload-image-file.minio.services:")(err)
          return MinioErrors.UploadImageToMinioError.new("Upload image error.")()
        },
        // eslint-disable-next-line node/prefer-global/buffer
        try: () => minioClient.putObject(bucket_name, file_name, Buffer.from(arrayBuffer)),

      }).pipe(
        // Effect.tap(b => console.log("UploadedObjectInfo", b)),

        Effect.retry(
          pipe(
            Schedule.recurs(3),
            Schedule.addDelay(() => Duration.seconds(10)),
          ),
        ),
      ),
    ),
    // Effect.andThen(b => b),

    Effect.tap(() => Effect.log("Upload image process successful.")),
    Effect.andThen(uploaded => ({ ...uploaded, name: file_name, path: `/${bucket_name}/${file_name}` })),
    // Effect.tap(b => console.log("update uploaded", b)),
    Effect.catchTags({
      ConfigError: (err) => {
        showErrorLog("get-authorized-user.axios.services:")(err)
        return MinioErrors.ConfigEnvError.new("Config env error.")(err)
      },
    }),
    // Effect.tapErrorTag(""),
  )
}

export function deleteFile(fileName: UserSchema.User["profileImageName"]) {
  return Effect.Do.pipe(
    Effect.bind("fileNames", () => {
      if (!fileName) {
        return Effect.fail(MinioErrors.FileNameError.new("File name undefined.")())
      }
      return Effect.succeed(fileName)
    }),
    Effect.bind("minioClient", () => getMinIOClient),
    Effect.andThen(({ fileNames, minioClient }) =>
      Effect.tryPromise({
        catch: (err) => {
          showErrorLog("delete-image-file.minio.services:")(err)
          return MinioErrors.DeleteFileError.new("Delete image error.")()
        },
        try: () => minioClient.removeObject(bucket_name, fileNames),
      }).pipe(
        Effect.retry(
          pipe(
            Schedule.recurs(3),
            Schedule.addDelay(() => Duration.seconds(10)),
          ),
        ),
      ),
    ),
    Effect.tap(() => Effect.log("Delete image process successful.")),
    Effect.andThen(() => ({ message: `Delete ${fileName} successful.` })),
    Effect.catchTags({
      ConfigError: (err) => {
        showErrorLog("get-authorized-user.axios.services:")(err)
        return MinioErrors.ConfigEnvError.new("Config env error.")(err)
      },
    }),
  )
}

export class MinioServiceContext extends Effect.Service<MinioServiceContext>()("service/Minio", {
  effect: Effect.Do.pipe(
    Effect.andThen(() => {
      return {
        deleteFile: (fileName: UserSchema.User["profileImageName"]) => deleteFile(fileName).pipe(
          Effect.withSpan("delete-image-file.minio.services"),
        ),
        uploadImageFile: (file: File) => uploadImageFile(file).pipe(
          Effect.withSpan("upload-image-file.minio.services"),
        ),
      }
    }),
  ),
}) { }
