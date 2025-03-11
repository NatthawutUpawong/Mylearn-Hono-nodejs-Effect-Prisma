/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema"


export const Schema = S.Struct({
  page: S.Number,
  itemPerpage: S.Number,
  totalPages: S.Number,
  nextPage: S.String,
  prevPage: S.String,
})

export type pagination = S.Schema.Type<typeof Schema>
export type paginationEncode = S.Schema.Encoded<typeof Schema>