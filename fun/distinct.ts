import { log } from "./log.js";
import { stringify } from "./stringify.js";

function isPrimitive(o) {
  return typeof o !== "object";
}

export function distinct(
  items: Array<any>
) {
  log("distinct.in", stringify(items));
  const result = _distinct(items);
  log(
    "distinct.out",
    stringify(result)
  );
  return result;
}

export function _distinct(
  items: Array<any>
) {
  const unique = new Set(items);
  let result = [...unique];
  const primitives = result
    .filter(isPrimitive)
    .sort();
  const objects = result.filter(
    (o) => !isPrimitive(o)
  );
  if (objects.length) {
    const hash = new Set();
    const uniqueObjects =
      objects.filter((o) => {
        const key = Object.entries(o)
          .map(
            ([k, v]) =>
              `${k}${
                typeof v === "string"
                  ? ":" + v
                  : ""
              }`
          )
          .join(".");
        if (hash.has(key)) return false;
        hash.add(key);
        return true;
      });
    result = [
      ...primitives,
      ...uniqueObjects,
    ];
  }
  return result;
}
