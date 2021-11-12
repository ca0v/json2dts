export function stringify(o) {
  return JSON.stringify(o).replaceAll(
    `"`,
    ``
  );
}
