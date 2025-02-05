/* eslint-disable ts/no-redeclare */
import * as S from "effect/Schema"

export const UserId = S.Number.pipe(S.brand("UserId")).annotations({ jsonSchema: { type: "number" } })
export type UserId = S.Schema.Type<typeof UserId>

export const UserIdFromString = S.transform(
  S.NumberFromString,
  UserId,
  {
    decode: id => UserId.make(id),
    encode: id => id,
  },
)

