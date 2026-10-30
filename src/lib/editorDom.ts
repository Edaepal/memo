import type { Block, Run } from "@/data/memoDetails";

const BLOCK_TAGS = new Set(["DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI"]);

function isBold(el: HTMLElement) {
  const weight = el.style.fontWeight;
  return el.tagName === "B" || el.tagName === "STRONG" || weight === "bold" || Number(weight) >= 600;
}

function pushRun(runs: Run[], text: string, bold: boolean) {
  if (!text) return;
  const last = runs[runs.length - 1];
  if (last && Boolean(last.bold) === bold) last.text += text;
  else runs.push(bold ? { text, bold } : { text });
}

function collectRuns(nodes: Iterable<Node>, bold: boolean, runs: Run[]) {
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      pushRun(runs, (node.textContent ?? "").replace(/ /g, " "), bold);
    } else if (node instanceof HTMLElement) {
      if (node.tagName === "BR") pushRun(runs, "\n", bold);
      else collectRuns(node.childNodes, bold || isBold(node), runs);
    }
  }
}

function toRuns(nodes: Iterable<Node>) {
  const runs: Run[] = [];
  collectRuns(nodes, false, runs);
  const last = runs[runs.length - 1];
  if (last) last.text = last.text.replace(/\n+$/, "");
  return runs.filter((run) => run.text.length > 0);
}

const hasText = (runs: Run[]) => runs.some((run) => run.text.trim().length > 0);

const isBlockEl = (node: Node): node is HTMLElement =>
  node instanceof HTMLElement && BLOCK_TAGS.has(node.tagName);

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function runsToHtml(runs: Run[]) {
  return runs
    .map((run) => {
      const html = escapeHtml(run.text).replace(/\n/g, "<br>");
      return run.bold ? `<b>${html}</b>` : html;
    })
    .join("");
}

// 저장된 블록을 편집기(contenteditable)에 넣을 HTML로 되돌린다. domToBlocks의 반대 방향이다.
export function blocksToHtml(blocks: Block[]) {
  return blocks
    .map((block) => {
      switch (block.kind) {
        case "h2":
        case "h3":
          return `<${block.kind}>${escapeHtml(block.text)}</${block.kind}>`;
        case "p":
          return `<div>${runsToHtml(block.runs)}</div>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${runsToHtml(item)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}

// 편집기(contenteditable)의 DOM을 저장용 블록으로 바꾼다. 서식은 블록 종류와 굵게만 남긴다.
// 브라우저가 줄마다 만드는 <div> 안에 목록·제목이 중첩될 수 있어서 안쪽까지 내려가며 읽는다.
export function domToBlocks(root: HTMLElement): Block[] {
  const blocks: Block[] = [];

  const walk = (parent: Node) => {
    let pending: Node[] = [];
    const flush = () => {
      const runs = toRuns(pending);
      if (hasText(runs)) blocks.push({ kind: "p", runs });
      pending = [];
    };

    for (const node of parent.childNodes) {
      if (!isBlockEl(node)) {
        pending.push(node);
        continue;
      }
      flush();
      if (node.tagName === "H2" || node.tagName === "H3") {
        const text = (node.textContent ?? "").replace(/ /g, " ").trim();
        if (text) blocks.push({ kind: node.tagName === "H2" ? "h2" : "h3", text });
      } else if (node.tagName === "UL" || node.tagName === "OL") {
        const items = [...node.children].map((li) => toRuns(li.childNodes)).filter(hasText);
        if (items.length) blocks.push({ kind: "list", items });
      } else if ([...node.childNodes].some(isBlockEl)) {
        walk(node);
      } else {
        const runs = toRuns(node.childNodes);
        if (hasText(runs)) blocks.push({ kind: "p", runs });
      }
    }
    flush();
  };

  walk(root);
  return blocks;
}
