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

// import { Effect } from "effect"
// import * as Minio from "minio"

// export const getMinIOClient = Effect.sync(() => {
//   return new Minio.Client({
//     accessKey: "DZsTe4ihumN0sqDtzFOQ",
//     endPoint: "localhost",
//     port: 9000,
//     secretKey: "A6yrRNhtTiZ8wZ2orraGxB4ZUO2sDg4XyFoUascb",
//     useSSL: false,
//   })
// })
