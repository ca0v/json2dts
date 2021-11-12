function stringify(o) {
  return JSON.stringify(o);
}

function isPrimitive(o) {
  return typeof o !== "object";
}

function reduce(o: Array<any>) {
  return [...new Set(o)];
}

export function typedef(o: object) {
  console.log(
    "typedef.in",
    stringify(o)
  );
  const result = _typedef(o);
  console.log(
    "typedef.out",
    stringify(result)
  );
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
