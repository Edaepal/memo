"use client";

import { formatDateTime } from "@/lib/memoFormat";
import { useSavedMemo } from "@/lib/memoStorage";
import { MemoArticleView } from "./MemoBody";

// 메모는 Supabase에서 브라우저가 읽어 보여 준다.
export function SavedMemoArticle({ id }: { id: string }) {
  const memo = useSavedMemo(id);

  if (memo === undefined) return null;
  if (memo === null) {
    return (
      <p className="rounded-xl bg-surface-card px-space-20 py-space-24 text-body-md text-text-secondary">
        메모를 찾을 수 없어요. 삭제된 메모일 수 있어요.
      </p>
    );
  }
  return <MemoArticleView memo={{ ...memo, createdAt: formatDateTime(memo.createdAt) }} />;
}
