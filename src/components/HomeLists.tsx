"use client";

import { useSavedMemos } from "@/lib/memoStorage";

// 홈 상단의 메모 개수: Supabase에 저장된 실제 메모 수.
export function MemoCount() {
  return <>{useSavedMemos()?.length ?? 0}</>;
}
