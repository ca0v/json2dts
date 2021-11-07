export function jsontodts(o) {
  return asInterface("ITest", o);
}

export function asInterface(name, o) {
  return `interface ${name} ${stringify(asTypeDefinition(o), false)}`;
}

export function unique(items) {
  return [...new Set(items)];
}

export function stringify(o, terse = true) {
  const v = terse ? JSON.stringify(o) : JSON.stringify(o, null, "  ");
  return v.replaceAll(`"`, "");
}

function isString(o) {
  return typeof o === "string";
}

function isObject(o) {
  return typeof o === "object";
}

function isDefined(o) {
  return typeof o !== "undefined";
}

function isArray(o) {
  return Array.isArray(o);
}

export function sort(o) {
  const result = {};
  Object.keys(o)
    .sort()
    .forEach((k) => (result[k] = o[k]));
  return result;
}

/**
 *
 */
export function consolidate(types) {
  if (!types?.length) return [];
  const [head, ...tail] = types;
  if (!tail.length) return [head];
  if (isString(head)) {
    const others = tail.filter((t) => t !== head);
    return [head, ...consolidate(others)].sort();
  }

  if (isArray(head)) {
    let result = consolidate(head);
    tail.forEach((t) => {
      if (isArray(t)) {
        result.push(...t);
      }
    });
    result = consolidate(result);
    return unique(result);
  }
  tail.forEach((t) => {
    const keys = Object.keys(t);
    keys.forEach((key) => {
      head[key] = !isDefined(head[key])
        ? t[key]
        : consolidate([head[key], t[key]]);
    });
  });
  return [head];
}

function isPrimitive(t) {
  switch (t) {
    case "number":
    case "boolean":
    case "string":
    case "date":
      return true;
    case "array":
    case "object":
      return false;
    default:
      throw `unknown type: ${t}`;
  }
}

function consolidateInto(t1, t2) {
  if (isPrimitive(t1) && isPrimitive(t2)) return t1 == t2 ? [t1] : [t1, t2];
  if (isPrimitive(t1) || isPrimitive(t2)) return [t1, t2];
}

export function unionTypes(types) {
  if (!types?.length) return "any";

  const prims = unique(types.filter((t) => typeof t === "string"));

  const complex = consolidate(types.filter((t) => typeof t === "object"));

  prims.push(...complex.map(stringify).join("|"));

  const items = prims;
  if (items.length > 3) return "any";
  return items.sort().join("|");
}

export function asTypeDefinition(o) {
  const typeName = typeof o;
  switch (typeName) {
    case "":
      return "undefined";
    case "undefined":
    case "null":
    case "string":
    case "number":
    case "boolean":
      return typeName;
    case "object": {
      if (o instanceof Date) return "Date";
      if (isArray(o)) {
        return unique(o.map(asTypeDefinition)).sort();
      }

      const keys = Object.keys(o);
      if (!keys.length) return "unknown";
      const result = {};
      keys.forEach((k) => {
        result[k] = asTypeDefinition(o[k]);
      });
      return result;
    }
    default:
      return "unknown";
  }
}
