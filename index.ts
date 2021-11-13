import { full } from "./fun/full.js";

const myFull = (o) =>
  `interface I ${full(o)};`;

// Write Javascript code!
const inputValue =
  document.getElementById(
    "input_json"
  ) as HTMLInputElement;

const outputValue =
  document.getElementById(
    "output_json"
  ) as HTMLInputElement;

const [log, nextButton] = [
  "log",
  "next",
].map((k) =>
  document.getElementById(k)
);
outputValue.innerHTML = `<h1>JS Starter</h1>`;

const samples = [
  { a: [{ b: [1] }] },
  {
    a: [
      { a: 1 },
      { a: !1 },
      { b: "" },
      { b: 0, a: new Date() },
    ],
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
    o: {
      a: [""],
      n: [0, 1],
      d: [new Date(), 10],
    },
    ca: [
      { a: 1 },
      { b: 2 },
      { a: 1, b: 1 },
    ],
    cx: {
      a: 1,
      b: [1],
      c: {
        a: 1,
        b: [1, 2, 3, "", 4, 5, 7],
      },
      d: {
        a: 1,
        b: [1, "b", 2, new Date(), {}],
      },
      e: { a: 1, b: [1] },
    },
  },
];

function render() {
  try {
    // JSON.parse expects quoted key names
    let o = [eval][0](
      `(${inputValue.value})`
    );
    outputValue.value = `${myFull(o)}`;
  } catch (ex) {
    log.innerText = ex;
  }
}

inputValue.onkeyup = () => render();

let sampleIndex = -1;
nextButton.onclick = () => {
  sampleIndex =
    (1 + sampleIndex) % samples.length;
  inputValue.value = JSON.stringify(
    samples[sampleIndex],
    null,
    "  "
  );
  render();
};

nextButton.click();
