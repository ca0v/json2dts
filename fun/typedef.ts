export function typedef(o: object) {
  return _typedef(o);
}

function isPrimitive(o) {
  return typeof o !== "object";
}

function reduce(o: Array<any>) {
  return [...new Set(o)];
}

function _typedef(o: object) {
  if (isPrimitive(o)) return typeof o;
  if (Array.isArray(o)) return reduce(o.map(_typedef));
  const result = Object.entries(o).map(([key, value]) => [
    key,
    _typedef(value),
  ]);
  return Object.fromEntries(result);
}
