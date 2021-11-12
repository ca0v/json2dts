import { typedef } from "./typedef.js";
import { reduce } from "./reduce.js";
import { typing } from "./typing.js";

export function full(o) {
  return typing(reduce(typedef(o)));
}
