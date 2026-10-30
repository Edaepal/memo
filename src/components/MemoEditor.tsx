"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { blocksToHtml, domToBlocks } from "@/lib/editorDom";
import { saveMemo, updateMemo, type SavedMemo } from "@/lib/memoStorage";
import { ButtonPrimary } from "./ButtonPrimary";
import { IconLink } from "./IconButton";
import { IconChevronLeft } from "./icons";
import type { MemoLabel } from "./memoLabel";

type Fields = { title: string; category: string; label: MemoLabel };

const categories = ["업무", "개인", "아이디어"];

const INITIAL_FIELDS: Fields = { title: "", category: categories[0], label: "blue" };

const dotClass: Record<MemoLabel, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};
const dotName: Record<MemoLabel, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
};

type Format = "bold" | "h2" | "h3" | "list";
const tools: { format: Format; label: string }[] = [
  { format: "bold", label: "B" },
  { format: "h2", label: "제목" },
  { format: "h3", label: "소제목" },
  { format: "list", label: "목록" },
];

function readActiveFormats() {
  const block = document.queryCommandValue("formatBlock").toLowerCase();
  return {
    bold: document.queryCommandState("bold"),
    h2: block === "h2",
    h3: block === "h3",
    list: document.queryCommandState("insertUnorderedList"),
  } satisfies Record<Format, boolean>;
}

const fieldsOf = (memo?: SavedMemo): Fields =>
  memo ? { title: memo.title, category: memo.category, label: memo.label } : INITIAL_FIELDS;

// memo가 있으면 그 메모를 고치는 화면이고, 없으면 새 메모를 쓰는 화면이다.
export function MemoEditor({ memo }: { memo?: SavedMemo }) {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // 메모 목록이 다시 읽혀도 고치던 글이 덮이지 않게, 화면이 열릴 때의 메모만 쓴다.
  const memoRef = useRef(memo);
  useEffect(() => {
    memoRef.current = memo;
  });

  const [fields, setFields] = useState<Fields>(() => fieldsOf(memo));
  const { title, category, label } = fields;
  const [bodyEmpty, setBodyEmpty] = useState(!memo?.blocks.length);
  const [active, setActive] = useState<Record<Format, boolean>>({
    bold: false,
    h2: false,
    h3: false,
    list: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // 화면은 열 때마다 시작 상태여야 한다. 새 메모는 빈 상태, 수정은 저장된 메모 그대로다.
  // 화면을 떠날 때 비워 두어서, 저장하지 않고 나갔다 와도(화면 상태가 유지되는 경우 포함) 이전 글이 남지 않는다.
  useEffect(() => {
    const body = bodyRef.current;
    const start = memoRef.current;
    if (body && start) {
      body.innerHTML = blocksToHtml(start.blocks);
      setFields(fieldsOf(start));
      setBodyEmpty(domToBlocks(body).length === 0);
    }
    return () => {
      body?.replaceChildren();
      setFields(INITIAL_FIELDS);
      setBodyEmpty(true);
      setActive({ bold: false, h2: false, h3: false, list: false });
      setError("");
      setSaving(false);
    };
  }, []);

  // 커서가 있는 글자의 서식을 툴바에 보인다.
  useEffect(() => {
    const onSelectionChange = () => {
      const selection = document.getSelection();
      if (selection?.anchorNode && bodyRef.current?.contains(selection.anchorNode)) {
        setActive(readActiveFormats());
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const update = (patch: Partial<Fields>) => {
    setFields((current) => ({ ...current, ...patch }));
    setError("");
  };

  const applyFormat = (format: Format) => {
    bodyRef.current?.focus();
    if (format === "bold") document.execCommand("bold");
    else if (format === "list") document.execCommand("insertUnorderedList");
    else document.execCommand("formatBlock", false, active[format] ? "div" : format);
    setActive(readActiveFormats());
    onBodyInput();
  };

  const onBodyInput = () => {
    if (!bodyRef.current) return;
    setBodyEmpty(domToBlocks(bodyRef.current).length === 0);
    setError("");
  };

  const onSave = async () => {
    if (saving) return;
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    const content = {
      title: title.trim(),
      category,
      label,
      blocks: bodyRef.current ? domToBlocks(bodyRef.current) : [],
    };
    const saved = memo ? await updateMemo(memo.id, content) : await saveMemo(content);
    if (!saved) {
      setSaving(false);
      setError("저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.");
      return;
    }
    router.push(memo ? `/memo/${memo.id}` : "/");
  };

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-surface-page px-space-16 pt-space-48">
      <header className="flex items-center">
        <IconLink
          label={memo ? "메모로 돌아가기" : "홈으로 돌아가기"}
          href={memo ? `/memo/${memo.id}` : "/"}
        >
          <IconChevronLeft />
        </IconLink>
      </header>

      <main className="mt-space-16 flex flex-1 flex-col gap-space-12">
        <label className="flex cursor-text flex-col gap-space-4 rounded-lg bg-surface-card px-space-20 py-space-16 focus-within:outline-2 focus-within:outline-primary">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            ref={titleRef}
            value={title}
            maxLength={100}
            placeholder="제목을 입력하세요"
            onChange={(e) => update({ title: e.target.value })}
            className="bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
          <div className="flex items-center gap-space-8">
            <span className="text-caption-sm text-text-muted">분류</span>
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={category === name}
                onClick={() => update({ category: name })}
                className={`flex h-[36px] items-center rounded-full px-space-16 text-label-md ${
                  category === name
                    ? "bg-primary text-text-on-primary"
                    : "bg-surface-card text-text-secondary"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-space-8">
            <span className="text-caption-sm text-text-muted">색</span>
            {(Object.keys(dotClass) as MemoLabel[]).map((name) => (
              <button
                key={name}
                type="button"
                aria-label={dotName[name]}
                aria-pressed={label === name}
                onClick={() => update({ label: name })}
                className={`flex size-[32px] items-center justify-center rounded-full ${
                  label === name ? "border-2 border-primary" : ""
                }`}
              >
                <span className={`size-[22px] rounded-full ${dotClass[name]}`} />
              </button>
            ))}
          </div>
        </div>

        <section className="flex flex-col overflow-hidden rounded-lg bg-surface-card outline-2 outline-transparent focus-within:outline-primary">
          <div className="flex h-[52px] items-center gap-space-4 px-space-12">
            {tools.map(({ format, label: text }) => (
              <button
                key={format}
                type="button"
                aria-pressed={active[format]}
                // 눌러도 본문의 글자 선택이 풀리지 않게 한다.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat(format)}
                className={`flex h-[36px] items-center justify-center rounded-sm px-space-12 text-label-md ${
                  active[format] ? "bg-label-blue-soft text-primary" : "text-text-secondary"
                }`}
              >
                {text}
              </button>
            ))}
          </div>
          <hr className="border-t border-border-default" />
          <div className="relative px-space-20 py-space-16">
            {bodyEmpty && (
              <p
                aria-hidden="true"
                className="pointer-events-none absolute text-body-md text-text-muted"
              >
                내용을 입력하세요
              </p>
            )}
            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="메모 내용"
              onInput={onBodyInput}
              className="min-h-[160px] text-body-md text-text-secondary outline-none [&_b]:font-bold [&_b]:text-text-primary [&_div]:mb-space-8 [&_h2]:mb-space-8 [&_h2]:text-title-lg [&_h2]:text-text-primary [&_h3]:mb-space-8 [&_h3]:text-title-md [&_h3]:text-text-primary [&_li]:relative [&_li]:pl-space-16 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['•'] [&_ul]:mb-space-8"
            />
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 bg-surface-page pb-space-34 pt-space-16">
        {error && (
          <p role="alert" className="pb-space-8 text-center text-caption-sm text-label-pink">
            {error}
          </p>
        )}
        <ButtonPrimary onClick={onSave}>저장하기</ButtonPrimary>
      </div>
    </div>
  );
}
