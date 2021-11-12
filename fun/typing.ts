import { log } from "./log.js";
import { stringify } from "./stringify.js";

function isPrimitive(o) {
  return typeof o !== "object";
}

export function typing(o) {
  log("typing.in", stringify(o));
  const result = _typing(o);
  log("typing.out", stringify(result));
  return result;
}

function _typing(o) {
  if (isPrimitive(o)) return o;
  if (Array.isArray(o)) {
    if (
      o.length === 1 &&
      Array.isArray(o[0])
    ) {
      // this is an array
      return [_typing(o[0])];
    } else {
      // these are types
      return o
        .map(typing)
        .map(stringify)
        .join("|");
    }
  }
  const result = Object.fromEntries(
    Object.entries(o).map(
      ([key, value]) => [
        key,
        typing(value),
      ]
    )
  );
  return stringify(result);
}
