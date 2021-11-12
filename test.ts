import { expect } from "chai";
import { typedef } from "./fun/typedef.js";
import { deep } from "./fun/deep.js";
import { reduce } from "./fun/reduce.js";
import { typing } from "./fun/typing.js";
import { full } from "./fun/full.js";

function log(o) {
  console.log(
    "_____ START ______________"
  );
  console.log(o);
  console.log(
    "_____ END ______________"
  );
  return o;
}

describe("typedef", () => {
  it("typedef simple", () => {
    expect(
      log(
        typedef({
          a: [1, !1],
        })
      )
    ).deep.equal(
      {
        a: [["number", "boolean"]],
      },
      "typedef simple mixed array"
    );

    expect(
      log(
        typedef({
          a: 1,
          b: [!1],
          c: "c",
        })
      )
    ).deep.equal(
      {
        a: ["number"],
        b: [["boolean"]],
        c: ["string"],
      },
      "simple typedef"
    );
  });

  it("typedef moderate", () => {
    expect(
      log(
        typedef({
          a: 1,
          b: [
            1,
            {
              c: 2,
            },
          ],
        })
      )
    ).deep.equal(
      {
        a: ["number"],
        b: [
          [
            "number",
            {
              c: ["number"],
            },
          ],
        ],
      },
      "simple moderate"
    );
  });

  it("typedef advanced", () => {
    expect(
      log(
        typedef({
          a: 1,
          b: [
            1,
            {
              c: 2,
            },
          ],
        })
      )
    ).deep.equal(
      {
        a: ["number"],
        b: [
          [
            "number",
            {
              c: ["number"],
            },
          ],
        ],
      },
      "typedef advanced 1"
    );

    expect(
      log(
        typedef({
          a: [1, !1],
          b: [!1],
          c: {
            d: "d",
          },
        })
      )
    ).deep.equal(
      {
        a: [["number", "boolean"]],
        b: [["boolean"]],
        c: [
          {
            d: ["string"],
          },
        ],
      },
      "typedef advanced 2"
    );
  });
});

describe("deep", () => {
  it("simple deep", () => {
    const o1 = {
      a: 1,
    };
    const o2 = {
      b: [1, { c: 2 }],
    };
    const o3 = {
      a: 1,
      b: [1, { c: 2 }],
    };
    expect(
      log(deep(o1, o2))
    ).deep.equal(o3, "simple deep");
  });

  it("moderate deep", () => {
    const o1 = {
      a: 1,
      b: [1, { c: 2 }],
    };
    const o2 = {
      a: 1,
      b: [1, { c: 2 }],
    };
    const o3 = {
      a: 1,
      b: [1, { c: 2 }, 1, { c: 2 }],
    };
    expect(
      log(deep(o1, o2))
    ).deep.equal(o3, "moderate deep");
  });

  it("deep other", () => {
    // {"a":1}, {"b":[[1,{"c":1}]]}
    expect(
      log(
        deep(
          { a: 1 },
          {
            b: [
              [
                1,
                {
                  c: 1,
                },
              ],
            ],
          }
        )
      )
    ).deep.equal(
      {
        a: 1,
        b: [
          [
            1,
            {
              c: 1,
            },
          ],
        ],
      },
      "deep other"
    );
  });
});

describe("reduce", () => {
  it("simple reduce", () => {
    expect(
      log(reduce([[1], [1]]))
    ).deep.equal(
      [[1]],
      "simple reduce [1]"
    );

    expect(
      log(
        reduce([
          {
            a: [1],
          },
          {
            a: [1],
          },
        ])
      )
    ).deep.equal(
      [{ a: [1] }],
      "simple reduce a:[1]"
    );

    const o1 = {
      n: 1,
      a: [2],
    };
    const o2 = {
      n: 1,
      a: [2],
    };
    const o3 = {
      n: 1,
      a: [2],
    };
    expect(
      log(reduce([o1, o2]))
    ).deep.equal(
      [o3],
      "simple reduce 2"
    );
  });

  it("moderate reduce", () => {
    const o1 = {
      a: [1],
    };
    const o2 = {
      b: [
        [
          1,
          {
            c: [1],
          },
        ],
      ],
    };
    const o3 = {
      a: [1],
      b: [
        [
          1,
          {
            c: [1],
          },
        ],
      ],
    };
    expect(
      log(reduce([o1, o2]))
    ).deep.equal(
      [o3],
      "moderate reduce"
    );
  });

  it("advanced reduce", () => {
    const o1 = {
      a: [1],
      b: [[1, 1, 1]],
    };
    const o2 = {
      b: [{ c: [1] }],
    };
    const o3 = {
      a: [1],
      b: [[1], { c: [1] }],
    };
    expect(
      log(reduce([o1, o2]))
    ).deep.equal(
      [o3],
      "advanced reduce"
    );
  });
});

describe("typing", () => {
  it("simple typing", () => {
    expect(log(typing({}))).equal("{}");
    expect(
      log(
        typing({
          a: "number",
        })
      )
    ).equal(`{a:number}`);
    expect(
      log(
        typing({
          a: ["number", "string"],
        })
      )
    ).equal(`{a:number|string}`);
  });
});

describe("object->typing", () => {
  it("simple", () => {
    expect(
      log(
        full({
          a: 1,
        })
      )
    ).equal("{a:number}");
    expect(
      log(
        full({
          a: [1],
        })
      )
    ).equal("{a:Array<number>}");
  });

  it("moderate", () => {
    expect(
      log(
        full({
          a: 1,
          b: [1, !1],
          c: [{ d: 1 }, { d: !1 }],
        })
      )
    ).equal(
      "{a:number,b:Array<boolean|number>,c:Array<{d:boolean|number}>}"
    );
  });

  it("advanced", () => {
    expect(
      log(
        full({
          a: 1,
          b: [1, !1, "1"],
          c: [
            { d: 2 },
            { d: !1 },
            { d: 1 },
            { d: !1 },
          ],
        })
      )
    ).equal(
      "{a:number,b:Array<boolean|number|string>,c:Array<{d:boolean|number}>}"
    );
  });
});
