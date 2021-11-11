import { expect } from "chai";
import { typedef } from "./fun/typedef.js";
import { deep } from "./fun/deep.js";
import { reduce } from "./fun/reduce.js";

function log(o) {
  console.log("_____ START ______________");
  console.log(o);
  console.log("_____ END ______________");
  return o;
}

describe("typedef", () => {
  it("typedef", () => {
    expect(log(typedef({ a: 1, b: [1, { c: 2 }] }))).deep.equal(
      { a: "number", b: ["number", { c: "number" }] },
      "simple typedef"
    );
  });
});

describe("deep", () => {
  it("simple deep", () => {
    const o1 = { a: 1 };
    const o2 = { b: [1, { c: 2 }] };
    const o3 = { a: 1, b: [1, { c: 2 }] };
    expect(log(deep(o1, o2))).deep.equal(o3, "simple deep");
  });

  it("moderate deep", () => {
    const o1 = { a: 1, b: [1, { c: 2 }] };
    const o2 = { a: 1, b: [1, { c: 2 }] };
    const o3 = { a: 1, b: [1, { c: 2 }, 1, { c: 2 }] };
    expect(log(deep(o1, o2))).deep.equal(o3, "moderate deep");
  });

  it("deep other", () => {
    // {"a":1}, {"b":[[1,{"c":1}]]}
    expect(log(deep({ a: 1 }, { b: [[1, { c: 1 }]] }))).deep.equal(
      { a: 1, b: [[1, { c: 1 }]] },
      "deep other"
    );
  });
});

describe("reduce", () => {
  it("simple reduce", () => {
    expect(log(reduce([[1], [1]]))).deep.equal([[1]], "simple reduce [1]");

    expect(log(reduce([{ a: [1] }, { a: [1] }]))).deep.equal(
      [{ a: [1] }],
      "simple reduce a:[1]"
    );

    const o1 = { n: 1, a: [2] };
    const o2 = { n: 1, a: [2] };
    const o3 = { n: 1, a: [2] };
    expect(log(reduce([o1, o2]))).deep.equal([o3], "simple reduce 2");
  });

  it("moderate reduce", () => {
    const o1 = { a: [1] };
    const o2 = { b: [[1, { c: [1] }]] };
    const o3 = { a: [1], b: [[1, { c: [1] }]] };
    expect(log(reduce([o1, o2]))).deep.equal([o3], "moderate reduce");
  });

  it("advanced reduce", () => {
    const o1 = { a: [1], b: [[1, 1, 1]] };
    const o2 = { b: [{ c: [1] }] };
    const o3 = { a: [1], b: [[1], { c: [1] }] };
    expect(log(reduce([o1, o2]))).deep.equal([o3], "advanced reduce");
  });
});
