"use client";

import { use } from "react";
import { setPinned, useSavedMemo } from "@/lib/memoStorage";
import { IconButton } from "./IconButton";
import { IconPinLarge } from "./icons";

// 상세 화면의 고정 버튼. 누르면 홈의 "고정한 메모" 목록에 들어가고, 다시 누르면 빠진다.
export function PinButton({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const memo = useSavedMemo(id);
  const pinned = memo?.pinned ?? false;

  return (
    <IconButton
      label={pinned ? "고정 해제" : "고정"}
      active={pinned}
      disabled={!memo}
      onClick={() => setPinned(id, !pinned)}
    >
      <IconPinLarge />
    </IconButton>
  );
}
