import { log } from "./log.js";
import { stringify } from "./stringify.js";

export function deep(o1, o2) {
  log(
    "deep.in",
    stringify(o1),
    stringify(o2)
  );
  const result = _deep(o1, o2);
  log("deep.out", stringify(result));
  return result;
}

function isDefined(o) {
  return typeof o !== "undefined";
}

function isPrimitive(o) {
  return typeof o !== "object";
}

export function _deep(o1, o2) {
  if (o1 === o2) return o1;
  if (isPrimitive(o1)) {
    if (Array.isArray(o2)) {
      return [o1, ...o2];
    } else {
      return [o1, o2];
    }
  } else if (Array.isArray(o1)) {
    if (Array.isArray(o2)) {
      return [...o1, ...o2];
    } else {
      return [...o1, o2];
    }
  } else {
    if (isPrimitive(o2)) {
      return [o1, o2];
    } else if (Array.isArray(o2)) {
      return [o1, ...o2];
    } else {
      const result = { ...o1 };
      Object.entries(o2).forEach(
        ([key, value]) => {
          if (!isDefined(result[key])) {
            result[key] = value;
          } else {
            result[key] = _deep(
              result[key],
              value
            );
          }
        }
      );
      return result;
    }
  }
}
