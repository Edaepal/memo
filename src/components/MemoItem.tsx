import Link from "next/link";
import { IconNote } from "./icons";
import { labelClass, type MemoLabel } from "./memoLabel";

export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  category: string;
  label: MemoLabel;
};

export function MemoItem({ id, title, preview, date, label }: Memo) {
  return (
    <Link
      href={`/memo/${id}`}
      className="flex h-[72px] w-full items-center gap-space-16 px-space-20 py-space-12 text-left"
    >
      <span
        className={`flex size-[44px] shrink-0 items-center justify-center rounded-sm ${labelClass[label]}`}
      >
        <IconNote />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-space-4">
        <span className="text-title-md text-text-primary">{title}</span>
        <span className="truncate text-body-sm text-text-secondary">{preview}</span>
      </span>
      <span className="shrink-0 text-caption-sm text-text-muted">{date}</span>
    </Link>
  );
}
