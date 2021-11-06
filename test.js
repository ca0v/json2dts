import { assert, expect } from "chai";
import { jsontodts, typeOf } from "./fun/json-to-dts.js";

describe("test", () => {
  it("test", () => {
    assert.isFunction(jsontodts);
    const result = typeOf({ a: [{ b: [1] }] });
    expect(result).to.deep.equal({ a: "Array<{b:Array<number>}>" });
  });
});
