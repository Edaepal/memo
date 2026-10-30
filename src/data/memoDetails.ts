import type { MemoLabel } from "@/components/memoLabel";

export type Run = { text: string; bold?: boolean };

export type Block =
  | { kind: "h2" | "h3"; text: string }
  | { kind: "p"; runs: Run[] }
  | { kind: "list"; items: Run[][] };

export type MemoDetail = {
  id: string;
  title: string;
  category: string;
  label: MemoLabel;
  createdAt: string;
  blocks: Block[];
};
