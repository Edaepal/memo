"use client";

import { useSavedMemo } from "@/lib/memoStorage";
import { MemoEditor } from "./MemoEditor";

// 수정 화면: 저장된 메모를 읽어 온 뒤에 그 내용으로 편집기를 연다.
export function EditMemo({ id }: { id: string }) {
  const memo = useSavedMemo(id);

  if (memo === undefined) return null;
  if (memo === null) {
    return (
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-surface-page px-space-16 pt-space-48">
        <p className="rounded-xl bg-surface-card px-space-20 py-space-24 text-body-md text-text-secondary">
          메모를 찾을 수 없어요. 삭제된 메모일 수 있어요.
        </p>
      </div>
    );
  }
  return <MemoEditor memo={memo} />;
}
