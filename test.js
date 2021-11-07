import { assert, expect } from "chai";
import {
  jsontodts,
  asTypeDefinition,
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

  it("tests asTypeDefinition primitives", () => {
    assert.equal(asTypeDefinition(!0), "boolean");
    assert.equal(asTypeDefinition(1), "number");
    assert.equal(asTypeDefinition("a"), "string");
  });

  it("tests asTypeDefinition simple objects", () => {
    expect(asTypeDefinition({ a: !0 })).deep.equal({ a: "boolean" });
    expect(asTypeDefinition({ a: 0 })).deep.equal({ a: "number" });
    expect(asTypeDefinition({ a: "" })).deep.equal({ a: "string" });
  });

  it("tests asTypeDefinition primitive arrays", () => {
    expect(asTypeDefinition([])).deep.equal([]);
    expect(asTypeDefinition([1])).deep.equal(["number"]);
    expect(asTypeDefinition([!0])).deep.equal(["boolean"]);
    expect(asTypeDefinition([""])).deep.equal(["string"]);
    expect(asTypeDefinition([1, 2, 3])).deep.equal(["number"], "[1,2,3]");
  });

  it("tests asTypeDefinition mixed arrays", () => {
    expect(asTypeDefinition([1, !0, ""])).deep.equal([
      "boolean",
      "number",
      "string",
    ]);

    expect(asTypeDefinition([[{ a: 1 }]])).deep.equal([[{ a: "number" }]]);
  });

  it("tests asTypeDefinition complex objects", () => {
    expect(asTypeDefinition({ a: [{ b: [1] }] })).deep.equal({
      a: [{ b: ["number"] }],
    });

    expect(
      asTypeDefinition({
        a: [{ b: [1] }, { b: [1] }, { b: [!1] }, { b: [""] }],
      })
    ).deep.equal({
      a: [
        { b: ["number"] },
        { b: ["number"] },
        { b: ["boolean"] },
        { b: ["string"] },
      ],
    });
  });

  it("tests asTypeDefinition deep", () => {
    let v = asTypeDefinition({
      a: [
        { b: [{ c: 1, d: 1 }] },
        { b: [1] },
        { b: [{ c: 1, d: !1 }] },
        { b: [{ c: 1, d: [1] }] },
      ],
    });
    expect(v).deep.equal({
      a: [
        { b: [{ c: "number", d: "number" }] },
        { b: ["number"] },
        { b: [{ c: "number", d: "boolean" }] },
        { b: [{ c: "number", d: ["number"] }] },
      ],
    });

    v = asTypeDefinition({
      a: [
        { b: [{ c: 1, d: 1 }] },
        { b: [{ c: 1, d: !1 }] },
        { b: [{ c: 1, d: "" }] },
      ],
    });

    expect(v).deep.equal({
      a: [
        { b: [{ c: "number", d: "number" }] },
        { b: [{ c: "number", d: "boolean" }] },
        { b: [{ c: "number", d: "string" }] },
      ],
    });
  });

  it("consolidate array of simple object types", () => {
    expect(
      consolidate([
        { b: ["number"] },
        { b: ["number"] },
        { b: ["boolean"] },
        { b: ["string"] },
      ])
    ).deep.equal(
      [{ b: ["boolean", "number", "string"] }],
      "multiple {b: primitive}"
    );
  });

  it("consolidate single objec type with duplicates", () => {
    expect(
      consolidate([{ a: [{ b: ["number"] }, { b: ["number"] }] }])
    ).deep.equal([{ a: [{ b: ["number"] }] }], "a:[b:multiple primitives]");
  });

  it("test consolidate single types", () => {
    let c = consolidate([asTypeDefinition([])]);
    expect(c).deep.equal([[]], "empty");

    c = consolidate([asTypeDefinition([1, 2, 3])]);
    expect(c).deep.equal([["number"]], "simple array");

    c = consolidate([asTypeDefinition([1, !1])]);
    expect(c).deep.equal([["boolean", "number"]], "mixed array");

    c = consolidate([asTypeDefinition([1, 2, 3])]);
    expect(c).deep.equal([["number"]], "simple array");
  });

  it("test consolidate two types", () => {
    let types = [{ a: 1 }, { a: 1 }].map(asTypeDefinition);
    let c = consolidate(types);
    expect(c).deep.equal([{ a: ["number"] }], "duplicate primitive types");

    types = [{ a: [1] }, { a: [1] }].map(asTypeDefinition);
    c = consolidate(types);
    expect(c).deep.equal([{ a: ["number"] }], "duplicate array types (number)");

    types = [
      {
        a: [
          {
            b: "string",
          },
        ],
      },
      {
        a: [
          {
            b: "number",
          },
        ],
      },
    ];
    c = consolidate(types);
    console.log(stringify(c));
    expect(c).deep.equal(
      [
        {
          a: [
            {
              b: ["number", "string"],
            },
          ],
        },
      ],
      "deep mixed array types"
    );
  });
});
