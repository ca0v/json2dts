// input xml string output xml string
export function format(xml: string) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(
    xml,
    "application/xml",
  );
  removeWhitespace(
    dom.documentElement,
    0,
  );
  const result =
    dom.documentElement.outerHTML;
  return result;
}

export function run() {
  const input =
    byId<HTMLTextAreaElement>(
      "request",
    );
  const output =
    byId<HTMLTextAreaElement>(
      "response",
    );
  const doit = () => {
    if (!input.value) return;
    output.value = format(input.value);
    save(input.value);
  };

  on(input, "change", doit);
  restore(input);
  doit();
}

function on(
  dom: HTMLElement,
  event: string,
  cb: () => void,
) {
  dom.addEventListener(event, cb);
  return () =>
    dom.removeEventListener(event, cb);
}

function byId<T extends HTMLElement>(
  id: string,
) {
  const selector = `#${id}`;
  const result = document.querySelector(
    selector,
  ) as T;
  if (!result)
    throw `expected to find ${selector}`;
  return result;
}

function save(value: string) {
  localStorage.setItem("xml", value);
}

function restore(
  target: HTMLTextAreaElement,
) {
  const value =
    localStorage.getItem("xml");
  if (!value) return;
  target.value = value;
}
function removeWhitespace(
  dom: Element,
  depth: number,
) {
  console.log(
    dom.nodeName,
    dom.nodeType,
    dom.textContent,
  );
  const children = Array.from(
    dom.childNodes,
  );

  switch (dom.nodeType) {
    case 1: {
      dom.parentElement?.insertBefore(
        new Text("\n" + spaces(depth)),
        dom,
      );
      break;
    }
    case 3: {
      const content = dom.textContent
        .replaceAll("\n", "")
        .replaceAll("\t", "")
        .trim();
      if (!content) {
        dom.remove();
        return;
      }
      dom.textContent = content;
      break;
    }
  }
  children.forEach((ch) =>
    removeWhitespace(
      ch as Element,
      depth + 1,
    ),
  );
}
function spaces(depth: number): string {
  const result = new Array(depth)
    .fill("  ")
    .join("");
  console.log(`${depth}: "${result}"`);
  return result;
}
