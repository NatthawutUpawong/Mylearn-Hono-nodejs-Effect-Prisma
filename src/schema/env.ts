import { Config } from "effect"

// const apiPdmsAuthUrlConfig = Config.string("API_PDMS_AUTH_URL")

// const databaseConfig = Config.all({
//   db_host: Config.string("DB_HOST"),
//   db_name: Config.string("DB_NAME"),
//   db_password: Config.string("DB_PASSWORD"),
//   db_port: Config.option(Config.integer("DB_PORT")),
//   db_url: Config.string("DATABASE_URL"),
//   db_username: Config.string("DB_USERNAME"),
// })

const minioConfig = Config.all({
  accessKey: Config.string("ACCESS_KEY"),
  //   domain: Config.string("DOMAIN"),
  host: Config.string("HOST"),
  port: Config.option(Config.integer("PORT")),
  secretKey: Config.string("SECRET_KEY"),
})
export const minioNestedConfig = Config.nested(minioConfig, "MINIO")

export const config = Config.all({
//   apiPdmsAuthUrl: apiPdmsAuthUrlConfig,
//   database: databaseConfig,
  minio: minioNestedConfig,
})
