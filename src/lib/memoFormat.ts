import type { Block } from "@/data/memoDetails";

const DAY = 24 * 60 * 60 * 1000;

// 홈 목록의 날짜: 오늘, 어제, 그 이전은 "10월 28일"
export function formatDay(iso: string) {
  const date = new Date(iso);
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startOf(new Date()) - startOf(date)) / DAY);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 상세 화면의 작성 시각: "10월 30일 오전 9:12"
export function formatDateTime(iso: string) {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(date);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${time}`;
}

// 홈 목록의 미리보기: 본문의 첫 줄
export function previewOf(blocks: Block[]) {
  for (const block of blocks) {
    const text =
      block.kind === "p"
        ? block.runs.map((run) => run.text).join("")
        : block.kind === "list"
          ? block.items[0]?.map((run) => run.text).join("")
          : block.text;
    const firstLine = text?.split("\n")[0].trim();
    if (firstLine) return firstLine;
  }
  return "";
}
