import { assert, expect } from "chai";
import {
  jsontodts,
  typeOf,
  asInterface,
  consolidate,
  sort,
  stringify,
  unionTypes,
  unique,
} from "./fun/json-to-dts.js";

describe("test jsontodts", () => {
  it("test sort", () => {
    assert.equal(Object.keys(sort({ b: 1, a: 1 })).join(","), "a,b");
  });

  it("test equal", () => {
    assert.equal(unique([1, 2, 3, 1]).join(","), "1,2,3");
  });

  it("test unionTypes", () => {
    const union = unionTypes(["string", { a: "foo" }, { a: "bar", b: "foo" }]);
    assert.equal(union, "string|{a:foo|bar,b:foo}");
  });

  it("test consolidate", () => {
    const union = consolidate([{ a: "foo" }, { a: "bar", b: "foo" }]);
    assert.equal(stringify(union), "{a:foo|bar,b:foo}");
  });

  it("tests typeof", () => {
    const result = typeOf({
      a: [
        {
          b: [1],
        },
      ],
    });
    assert.equal(result.a, "Array<{b:Array<number>}>");
    //expect(result.a).to.deep.equal([{ b: [0] }]);
  });
});
