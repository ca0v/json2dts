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
    assert.equal(typeOf(!0), "boolean");
    assert.equal(typeOf(1), "number");
    assert.equal(typeOf("a"), "string");

    expect(typeOf({ a: !0 })).deep.equal("{a:boolean}");
    expect(typeOf({ a: 0 })).deep.equal("{a:number}");
    expect(typeOf({ a: "" })).deep.equal("{a:string}");

    assert.equal(typeOf([]), "Array<any>");
    assert.equal(typeOf([1]), "Array<number>");
    assert.equal(typeOf([!0]), "Array<boolean>");
    assert.equal(typeOf([""]), "Array<string>");
    assert.equal(typeOf([1, !0, ""]), "Array<boolean|number|string>");
    assert.equal(typeOf([!1, 0, ""]), "Array<boolean|number|string>");
    assert.equal(typeOf([[{ a: 1 }]]), "Array<Array<{a:number}>>");

    assert.equal(typeOf({ a: [{ b: [1] }] }), "{a:Array<{b:Array<number>}>}");
    assert.equal(
      typeOf({ a: [{ b: [1] }, { b: [1] }, { b: [!1] }, { b: [""] }] }),
      "{a:Array<{b:Array<boolean>}|{b:Array<number>}|{b:Array<string>}>}"
    );

    assert.equal(
      typeOf({
        a: [
          { b: [{ c: 1, d: 1 }] },
          { b: [1] },
          { b: [{ c: 1, d: !1 }] },
          { b: [{ c: 1, d: "" }] },
        ],
      }),
      "{a:Array<{b:Array<any>}>"
    );

    assert.equal(
      typeOf({
        a: [
          { b: [{ c: 1, d: 1 }] },
          { b: [{ c: 1, d: !1 }] },
          { b: [{ c: 1, d: "" }] },
        ],
      }),
      "{a:Array<{b:Array<{c:number,d:boolean}>}|{b:Array<{c:number,d:number}>}|{b:Array<{c:number,d:string}>}>}"
    );
  });
});
