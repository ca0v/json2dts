// Import stylesheets
import './style.css';

// Write Javascript code!
const [appDiv, inputValue, log] = ['output_json', 'input_json', 'log'].map(
  (k) => document.getElementById(k)
);
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

function unionTypes(types) {
  if (!types?.length) return 'any';
  const items = unique(types)
    .filter((v) => !!v)
    .map((v) => {
      if (typeof v === 'string') return v;
      if (typeof v === 'object') return stringify(v);
      return v;
    });
  if (items.length === 1) return items[0];
  if (items.length > 3) return 'any';
  return items.join('|');
}

function typeOf(o) {
  if (typeof o === '') return 'undefined';
  if (typeof o === 'undefined') return 'undefined';
  if (typeof o === 'null') return 'undefined';
  if (typeof o === 'string') return 'string';
  if (typeof o === 'number') return 'number';
  if (typeof o === 'object') {
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
  return 'unknown';
}

function asInterface(name, o) {
  return `interface ${name} ${stringify(typeOf(o), false)}`;
}

const sample = {
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
};

inputValue.value = JSON.stringify(sample, null, '  ');
appDiv.value = `${asInterface('ITest', sample)}`;

inputValue.onkeyup = () => {
  try {
    let o;
    eval(`o = ${inputValue.value}`);
    appDiv.value = `${asInterface('ITest', o)}`;
  } catch (ex) {
    log.innerText = ex;
  }
};
