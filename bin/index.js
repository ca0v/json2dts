// bin/fun/log.js
function log(...args) {
}

// bin/fun/stringify.js
function stringify(o2) {
  return JSON.stringify(o2).replaceAll(`"`, ``);
}

// bin/fun/typedef.js
function isPrimitive(o2) {
  return typeof o2 !== "object";
}
function reduce(o2) {
  return [...new Set(o2)];
}
function typedef(o2) {
  log("typedef.in", stringify(o2));
  const result = _typedef(o2);
  log("typedef.out", stringify(result));
  return result;
}
function _typedef(o2) {
  if (isPrimitive(o2))
    return typeof o2;
  if (Array.isArray(o2))
    return reduce(o2.map(typedef));
  const result = Object.entries(o2).map(([key, value]) => [
    key,
    [typedef(value)]
  ]);
  return Object.fromEntries(result);
}

// bin/fun/deep.js
function deep(o1, o2) {
  log("deep.in", stringify(o1), stringify(o2));
  const result = _deep(o1, o2);
  log("deep.out", stringify(result));
  return result;
}
function isDefined(o2) {
  return typeof o2 !== "undefined";
}
function isPrimitive2(o2) {
  return typeof o2 !== "object";
}
function _deep(o1, o2) {
  if (o1 === o2)
    return o1;
  if (isPrimitive2(o1)) {
    if (Array.isArray(o2)) {
      return [o1, ...o2];
    } else {
      return [o1, o2];
    }
  } else if (Array.isArray(o1)) {
    if (Array.isArray(o2)) {
      return [...o1, ...o2];
    } else {
      return [...o1, o2];
    }
  } else {
    if (isPrimitive2(o2)) {
      return [o1, o2];
    } else if (Array.isArray(o2)) {
      return [o1, ...o2];
    } else {
      const result = { ...o1 };
      Object.entries(o2).forEach(([key, value]) => {
        if (!isDefined(result[key])) {
          result[key] = value;
        } else {
          result[key] = _deep(result[key], value);
        }
      });
      return result;
    }
  }
}

// bin/fun/distinct.js
function isPrimitive3(o2) {
  return typeof o2 !== "object";
}
function distinct(items) {
  log("distinct.in", stringify(items));
  const result = _distinct(items);
  log("distinct.out", stringify(result));
  return result;
}
function _distinct(items) {
  const unique = new Set(items);
  let result = [...unique];
  const primitives = result.filter(isPrimitive3).sort();
  const objects = result.filter((o2) => !isPrimitive3(o2));
  if (objects.length) {
    const hash = new Set();
    const uniqueObjects = objects.filter((o2) => {
      const key = Object.entries(o2).map(([k, v]) => `${k}${typeof v === "string" ? ":" + v : ""}`).join(".");
      if (hash.has(key))
        return false;
      hash.add(key);
      return true;
    });
    result = [
      ...primitives,
      ...uniqueObjects
    ];
  }
  return result;
}

// bin/fun/reduce.js
function reduce2(o2) {
  log("reduce.in", stringify(o2));
  const result = _reduce(o2);
  log("reduce.out", stringify(result));
  return result;
}
function isPrimitive4(o2) {
  return typeof o2 !== "object";
}
function _reduce(o2) {
  if (isPrimitive4(o2))
    return o2;
  if (Array.isArray(o2)) {
    const items = distinct(o2).map(reduce2);
    const primitives = items.filter(isPrimitive4).sort();
    const complex = items.filter((o3) => !isPrimitive4(o3)).map(reduce2);
    const nonArrayTypes = complex.filter((o3) => !Array.isArray(o3));
    let [head, ...tail] = nonArrayTypes;
    tail.forEach((t) => head = deep(head, t));
    const arrayTypes = complex.filter(Array.isArray);
    return [].concat(primitives).concat(arrayTypes).concat(head ? [head] : []);
  }
  const result = Object.entries(o2).map(([key, value]) => [
    key,
    reduce2(value)
  ]);
  return Object.fromEntries(result);
}

// bin/fun/typing.js
function isPrimitive5(o2) {
  return typeof o2 !== "object";
}
function typing(o2) {
  log("typing.in", stringify(o2));
  const result = _typing(o2);
  log("typing.out", stringify(result));
  return result;
}
function _typing(o2) {
  if (isPrimitive5(o2))
    return o2;
  if (Array.isArray(o2)) {
    if (o2.length === 1 && Array.isArray(o2[0])) {
      return `Array<${_typing(o2[0])}>`;
    } else {
      return o2.map(typing).map(stringify).join("|");
    }
  }
  const result = Object.fromEntries(Object.entries(o2).map(([key, value]) => [
    key,
    typing(value)
  ]));
  return stringify(result);
}

// bin/fun/full.js
function full(o2) {
  return typing(reduce2(typedef(o2)));
}

// bin/index.js
var myFull = (o2) => `interface I ${full(o2)};`;
var inputValue = document.getElementById("input_json");
var outputValue = document.getElementById("output_json");
var [log2, nextButton] = [
  "log",
  "next"
].map((k) => document.getElementById(k));
outputValue.innerHTML = `<h1>JS Starter</h1>`;
var samples = [
  { a: [{ b: [1] }] },
  {
    a: [
      { a: 1 },
      { a: false },
      { b: "" },
      { b: 0, a: new Date() }
    ]
  },
  {
    array1: [0],
    array2: ["", true],
    array3: ["", true, 0],
    array4: ["", true, new Date()],
    array5: ["", true, 0, new Date()],
    items: [
      0,
      { a: 1, d: true },
      { b: 1 },
      { a: 2 },
      { b: "", c: new Date() },
      ""
    ]
  },
  {
    s: "string",
    n: 1,
    e: {},
    d: new Date(),
    a: [1, "2"],
    o: {
      a: [""],
      n: [0, 1],
      d: [new Date(), 10]
    },
    ca: [
      { a: 1 },
      { b: 2 },
      { a: 1, b: 1 }
    ],
    cx: {
      a: 1,
      b: [1],
      c: {
        a: 1,
        b: [1, 2, 3, "", 4, 5, 7]
      },
      d: {
        a: 1,
        b: [1, "b", 2, new Date(), {}]
      },
      e: { a: 1, b: [1] }
    }
  }
];
function render() {
  try {
    let o;
    eval(`o = ${inputValue.value}`);
    outputValue.value = `${myFull(o)}`;
  } catch (ex) {
    log2.innerText = ex;
  }
}
inputValue.onkeyup = () => render();
var sampleIndex = -1;
nextButton.onclick = () => {
  sampleIndex = (1 + sampleIndex) % samples.length;
  inputValue.value = JSON.stringify(samples[sampleIndex], null, "  ");
  render();
};
nextButton.click();
