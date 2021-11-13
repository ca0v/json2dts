import { isPrimitive } from "./isDefined.js";
import { log } from "./log.js";
import { stringify } from "./stringify.js";

function reduce(o: Array<any>) {
  return [...new Set(o)];
}

export function typedef(o: object) {
  log("typedef.in", stringify(o));
  const result = _typedef(o);
  log("typedef.out", stringify(result));
  return result;
}

function _typedef(o: object) {
  if (isPrimitive(o)) return typeof o;
  if (Array.isArray(o))
    return reduce(o.map(typedef));
  const result = Object.entries(o).map(
    ([key, value]) => [
      key,
      [typedef(value)],
    ]
  );
  return Object.fromEntries(result);
}
