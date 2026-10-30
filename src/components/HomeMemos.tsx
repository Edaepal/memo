"use client";

import { useState } from "react";
import { formatDay, previewOf } from "@/lib/memoFormat";
import { useSavedMemos, type SavedMemo } from "@/lib/memoStorage";
import { CardHeader } from "./CardHeader";
import { CategoryChips } from "./CategoryChips";
import { MemoItem, type Memo } from "./MemoItem";

const ALL = "전체";

type HomeMemosProps = {
  categories: string[];
};

function MemoCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-surface-card py-space-8">
      {children}
    </section>
  );
}

// 분류 칩과 메모 카드를 함께 둔다. 고정한 메모는 "고정한 메모"에 보이고, "최근 메모"에도 그대로 남는다.
// 메모는 Supabase에서 읽고, 새로 쓴 메모가 맨 위에 온다.
export function HomeMemos({ categories }: HomeMemosProps) {
  const [selected, setSelected] = useState(categories[0]);

  const saved = useSavedMemos();
  const matches = (memo: SavedMemo) => selected === ALL || memo.category === selected;
  const toItem = (memo: SavedMemo): Memo => ({
    id: memo.id,
    title: memo.title,
    preview: previewOf(memo.blocks),
    date: formatDay(memo.createdAt),
    category: memo.category,
    label: memo.label,
  });
  const visible = (saved ?? []).filter(matches);
  const pinned = visible.filter((memo) => memo.pinned).map(toItem);
  const recent = visible.map(toItem);

  return (
    <>
      <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />
      {saved === undefined ? null : pinned.length === 0 && recent.length === 0 ? (
        <p
          role="status"
          className="rounded-xl bg-surface-card px-space-20 py-space-48 text-center text-body-md text-text-muted"
        >
          메모가 없습니다
        </p>
      ) : (
        <>
          {pinned.length > 0 && (
            <MemoCard>
              <CardHeader title="고정한 메모" pin />
              {pinned.map((memo) => (
                <MemoItem key={memo.id} {...memo} />
              ))}
            </MemoCard>
          )}
          {recent.length > 0 && (
            <MemoCard>
              <CardHeader title="최근 메모" action />
              {recent.map((memo) => (
                <MemoItem key={memo.id} {...memo} />
              ))}
            </MemoCard>
          )}
        </>
      )}
    </>
  );
}
