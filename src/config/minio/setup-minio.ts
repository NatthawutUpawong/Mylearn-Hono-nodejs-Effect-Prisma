import { Effect, Option } from "effect"
import * as Minio from "minio"
import { config } from "../../schema/env.js"

function getMinIOClientCurried() {
  return config.pipe(
    Effect.map(({ minio }) => {
      console.log({ minio })

      return new Minio.Client({
        accessKey: minio.accessKey,
        endPoint: minio.host,
        port: Option.getOrElse(minio.port, () => undefined),
        secretKey: minio.secretKey,
        useSSL: false,
      })
    }),
    // Effect.map((client) => {
    //   return () => client
    // }),
  )
}

export const getMinIOClient = getMinIOClientCurried()