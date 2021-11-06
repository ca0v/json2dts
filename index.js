// Import stylesheets
import './style.css';

// Write Javascript code!
const [appDiv, inputValue, log, nextButton] = [
  'output_json',
  'input_json',
  'log',
  'next',
].map((k) => document.getElementById(k));
appDiv.innerHTML = `<h1>JS Starter</h1>`;

// interesting...map is not called for empty element (2)
log.innerText = [1, , 3].map((v, i) => `typeof ${i}=${typeof v}`).join(',');

function unique(items) {
  return [...new Set(items)];
}

function stringify(o, terse = true) {
  const v = terse ? JSON.stringify(o) : JSON.stringify(o, null, '  ');
  return v.replaceAll(`"`, '');
}

function isString(o) {
  return typeof o === 'string';
}

function sort(o) {
  const result = {};
  Object.keys(o)
    .sort()
    .forEach((k) => (result[k] = o[k]));
  return result;
}

function consolidate(types) {
  if (!types.length) return false;
  if (types.length < 2) return types;
  const result = {};
  for (let i = 0; i < types.length; i++) {
    Object.keys(types[i]).forEach((key) => {
      const newType = types[i][key];
      if (!result[key]) {
        result[key] = newType;
        return;
      }
      if (result[key] === newType) {
        return;
      }
      if (isString(newType) && isString(result[key])) {
        result[key] += '|' + newType;
        return;
      }
      console.log('consolidate', key, result[key], newType);
      consolidate([result[key], types[i][key]]);
    });
  }
  return isString(result) ? result : sort(result);
}

function unionTypes(types) {
  if (!types?.length) return 'any';
  const prims = unique(types.filter((t) => typeof t === 'string'));

  const complex = consolidate(types.filter((t) => typeof t === 'object'));

  if (complex) prims.push(stringify(complex));

  const items = prims;
  if (items.length === 1) return items[0];
  if (items.length > 3) return 'any';
  return items.join('|');
}

function typeOf(o) {
  const typeName = typeof o;
  switch (typeName) {
    case '':
    case 'undefined':
    case 'null':
      return 'undefined';
    case 'string':
    case 'number':
    case 'boolean':
      return typeName;
    case 'object': {
      if (o instanceof Date) return 'Date';
      if (Array.isArray(o)) {
        const allTypes = o.map(typeOf);
        return `Array<${unionTypes(allTypes)}>`;
      }
      const keys = Object.keys(o);
      if (!keys.length) return 'unknown';
      const result = {};
      keys.forEach((k) => {
        result[k] = typeOf(o[k]);
      });
      return result;
    }
    default:
      return 'unknown';
  }
}

function asInterface(name, o) {
  return `interface ${name} ${stringify(typeOf(o), false)}`;
}

const samples = [
  {
    a: [{ a: 1 }, { a: !1 }, { b: '' }, { b: 0, a: new Date() }],
  },
  {
    array1: [0],
    array2: ['', !0],
    array3: ['', !0, 0],
    array4: ['', !0, new Date()],
    array5: ['', !0, 0, new Date()],
    items: [
      0,
      { a: 1, d: !0 },
      { b: 1 },
      { a: 2 },
      { b: '', c: new Date() },
      '',
    ],
  },
  {
    s: 'string',
    n: 1,
    e: {},
    d: new Date(),
    a: [1, '2'],
    o: { a: [''], n: [0, 1], d: [new Date(), 10] },
    ca: [{ a: 1 }, { b: 2 }, { a: 1, b: 1 }],
    cx: {
      a: 1,
      b: [1],
      c: { a: 1, b: [1, 2, 3, '', 4, 5, 7] },
      d: { a: 1, b: [1, 'b', 2, new Date(), {}] },
      e: { a: 1, b: [1] },
    },
  },
];

inputValue.value = JSON.stringify(samples[0], null, '  ');
appDiv.value = `${asInterface('ITest', samples[0])}`;

inputValue.onkeyup = () => {
  try {
    let o;
    eval(`o = ${inputValue.value}`);
    appDiv.value = `${asInterface('ITest', o)}`;
  } catch (ex) {
    log.innerText = ex;
  }
};

let sampleIndex = 0;
nextButton.onclick = () => {
  sampleIndex = (1 + sampleIndex) % samples.length;

  inputValue.value = JSON.stringify(samples[sampleIndex], null, '  ');
  appDiv.value = `${asInterface('ITest', samples[sampleIndex])}`;
};
