export function jsontodts(o) {
  return asInterface(o);
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

export function consolidate(types) {
  if (!types.length) return false;
  if (1 === types.length) return types[0];
  const result = {};
  for (let i = 0; i < types.length; i++) {
    Object.keys(types[i]).forEach((key) => {
      const newType = types[i][key];
      if (!result[key]) {
        result[key] = newType;
        return;
      }
      if (result[key] === newType) {
        return;
      }
      if (isString(newType) && isString(result[key])) {
        result[key] += "|" + newType;
        return;
      }
      console.log("consolidate", key, result[key], newType);
      result[key] = consolidate([result[key], types[i][key]]);
    });
  }
  return isObject(result) ? sort(result) : result;
}

export function unionTypes(types) {
  if (!types?.length) return "any";

  const prims = unique(types.filter((t) => typeof t === "string"));

  const complex = consolidate(types.filter((t) => typeof t === "object"));

  if (complex) prims.push(stringify(complex));

  const items = prims;
  if (items.length > 3) return "any";
  return items.join("|");
}

export function typeOf(o) {
  const typeName = typeof o;
  switch (typeName) {
    case "":
    case "undefined":
    case "null":
      return "undefined";
    case "string":
    case "number":
    case "boolean":
      return typeName;
    case "object": {
      if (o instanceof Date) return "Date";
      if (isArray(o)) {
        const allTypes = o.map(typeOf);
        return `Array<${unionTypes(allTypes)}>`;
      }
      const keys = Object.keys(o);
      if (!keys.length) return "unknown";
      const result = {};
      keys.forEach((k) => {
        result[k] = typeOf(o[k]);
      });
      return result;
    }
    default:
      return "unknown";
  }
}

export function asInterface(name, o) {
  return `interface ${name} ${stringify(typeOf(o), false)}`;
}
