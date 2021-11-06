interface ITest {
  s: string;
  n: number;
  e: unknown;
  d: string;
  a: Array<number | string>;
  o: {
    a: Array<string>;
    n: Array<number>;
    d: Array<string | number>;
  };
  c1: Array<{ a: number } | { b: number } | { a: number; b: number }>;
  c2: {
    a: number;
    b: Array<number>;
    c: {
      a: number;
      b: Array<number | string>;
    };
    d: {
      a: number;
      b: Array<number | string | unknown>;
    };
    e: {
      a: number;
      b: Array<number>;
    };
  };
}

const sample: ITest = {
  s: 'string',
  n: 1,
  e: {},
  d: '2021-11-06T04:12:09.725Z',
  a: [1, '2'],
  o: {
    a: [''],
    n: [0, 1],
    d: ['2021-11-06T04:12:09.725Z', 10],
  },
  c1: [
    {
      a: 1,
    },
    {
      b: 2,
    },
    {
      a: 1,
      b: 1,
    },
  ],
  c2: {
    a: 1,
    b: [1],
    c: {
      a: 1,
      b: [1, 2, 3, '', 4, 5, 7],
    },
    d: {
      a: 1,
      b: [1, 'b', 2, '2021-11-06T04:12:09.725Z', {}],
    },
    e: {
      a: 1,
      b: [1],
    },
  },
};
