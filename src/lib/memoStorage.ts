import { useSyncExternalStore } from "react";
import type { Block } from "@/data/memoDetails";
import type { MemoLabel } from "@/components/memoLabel";
import { supabase } from "./supabase";

export type SavedMemo = {
  id: string;
  title: string;
  category: string;
  label: MemoLabel;
  pinned: boolean;
  createdAt: string; // ISO
  blocks: Block[];
};

type MemoRow = {
  id: string;
  title: string;
  category: string;
  label: MemoLabel;
  pinned: boolean;
  created_at: string;
  blocks: Block[];
};

// undefined: 아직 Supabase에서 읽기 전
let memos: SavedMemo[] | undefined;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function fromRow(row: MemoRow): SavedMemo {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    label: row.label,
    pinned: row.pinned,
    createdAt: row.created_at,
    blocks: row.blocks,
  };
}

// 최신 메모를 Supabase에서 다시 읽는다. 읽는 중이면 같은 요청을 기다린다.
export function refreshMemos() {
  inflight ??= (async () => {
    const { data, error } = await supabase
      .from("memos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) {
      memos = (data as MemoRow[]).map(fromRow);
      emit();
    }
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  void refreshMemos();
  return () => {
    listeners.delete(onChange);
  };
}

const getSnapshot = () => memos;
const getServerSnapshot = () => undefined;

export function useSavedMemos() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// undefined: 아직 읽기 전, null: 저장된 메모 중에 없음
export function useSavedMemo(id: string) {
  const all = useSavedMemos();
  return all === undefined ? undefined : (all.find((memo) => memo.id === id) ?? null);
}

// 저장하지 못하면 false
export async function saveMemo(memo: Pick<SavedMemo, "title" | "category" | "label" | "blocks">) {
  const { error } = await supabase.from("memos").insert(memo);
  if (error) return false;
  await refreshMemos();
  return true;
}

// 고정 상태는 메모에 함께 저장한다. 화면에는 먼저 반영하고, 저장에 실패하면 되돌린다.
export async function setPinned(id: string, pinned: boolean) {
  const previous = memos;
  memos = memos?.map((memo) => (memo.id === id ? { ...memo, pinned } : memo));
  emit();
  const { error } = await supabase.from("memos").update({ pinned }).eq("id", id);
  if (error) {
    memos = previous;
    emit();
  }
  return !error;
}
