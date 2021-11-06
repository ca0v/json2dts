import { asInterface } from "./fun/json-to-dts.js";

// Write Javascript code!
const [appDiv, inputValue, log, nextButton] = [
  "output_json",
  "input_json",
  "log",
  "next",
].map((k) => document.getElementById(k));
appDiv.innerHTML = `<h1>JS Starter</h1>`;

// interesting...map is not called for empty element (2)
log.innerText = [1, , 3].map((v, i) => `typeof ${i}=${typeof v}`).join(",");

const samples = [
  {
    a: [{ a: 1 }, { a: !1 }, { b: "" }, { b: 0, a: new Date() }],
  },
  {
    array1: [0],
    array2: ["", !0],
    array3: ["", !0, 0],
    array4: ["", !0, new Date()],
    array5: ["", !0, 0, new Date()],
    items: [
      0,
      { a: 1, d: !0 },
      { b: 1 },
      { a: 2 },
      { b: "", c: new Date() },
      "",
    ],
  },
  {
    s: "string",
    n: 1,
    e: {},
    d: new Date(),
    a: [1, "2"],
    o: { a: [""], n: [0, 1], d: [new Date(), 10] },
    ca: [{ a: 1 }, { b: 2 }, { a: 1, b: 1 }],
    cx: {
      a: 1,
      b: [1],
      c: { a: 1, b: [1, 2, 3, "", 4, 5, 7] },
      d: { a: 1, b: [1, "b", 2, new Date(), {}] },
      e: { a: 1, b: [1] },
    },
  },
];

inputValue.value = JSON.stringify(samples[0], null, "  ");
appDiv.value = `${asInterface("ITest", samples[0])}`;

inputValue.onkeyup = () => {
  try {
    let o;
    eval(`o = ${inputValue.value}`);
    appDiv.value = `${asInterface("ITest", o)}`;
  } catch (ex) {
    log.innerText = ex;
  }
};

let sampleIndex = 0;
nextButton.onclick = () => {
  sampleIndex = (1 + sampleIndex) % samples.length;

  inputValue.value = JSON.stringify(samples[sampleIndex], null, "  ");
  appDiv.value = `${asInterface("ITest", samples[sampleIndex])}`;
};
