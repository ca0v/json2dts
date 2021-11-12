import { deep } from "./deep.js";
import { distinct } from "./distinct.js";

function stringify(o) {
  return JSON.stringify(o);
}

export function reduce(o: object) {
  console.log(
    "reduce.in",
    stringify(o)
  );
  const result = _reduce(o);
  console.log(
    "reduce.out",
    stringify(result)
  );
  return result;
}

function isPrimitive(o) {
  return typeof o !== "object";
}

function _reduce(o: object) {
  if (isPrimitive(o)) return o;
  if (Array.isArray(o)) {
    const items =
      distinct(o).map(reduce);
    // get all unique primitives
    const primitives = items
      .filter(isPrimitive)
      .sort();
    // reduce all objects and arrays
    const complex = items
      .filter((o) => !isPrimitive(o))
      .map(reduce);
    // combine them into a single composite type
    const nonArrayTypes =
      complex.filter(
        (o) => !Array.isArray(o)
      );
    let [head, ...tail] = nonArrayTypes;
    tail.forEach(
      (t) => (head = deep(head, t))
    );
    const arrayTypes = complex.filter(
      Array.isArray
    );
    return []
      .concat(primitives)
      .concat(arrayTypes)
      .concat(head ? [head] : []);
    // combine the object composite with prims for a final
  }
  const result = Object.entries(o).map(
    ([key, value]) => [
      key,
      reduce(value),
    ]
  );
  return Object.fromEntries(result);
}
