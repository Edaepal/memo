import { BlurFade } from "./ui/blur-fade";
import { labelClass } from "./memoLabel";
import type { Block, MemoDetail, Run } from "@/data/memoDetails";

function Runs({ runs }: { runs: Run[] }) {
  return runs.map((run, i) =>
    run.bold ? (
      <strong key={i} className="font-bold text-text-primary">
        {run.text}
      </strong>
    ) : (
      <span key={i}>{run.text}</span>
    ),
  );
}

function BodyBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return <h2 className="text-title-lg text-text-primary">{block.text}</h2>;
    case "h3":
      return <h3 className="text-title-md text-text-primary">{block.text}</h3>;
    case "p":
      return (
        <p className="whitespace-pre-line text-body-md text-text-secondary">
          <Runs runs={block.runs} />
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-space-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-space-8 text-body-md text-text-secondary">
              <span aria-hidden="true">•</span>
              <span className="min-w-0 flex-1 whitespace-pre-line">
                <Runs runs={item} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

export function MemoArticleView({ memo }: { memo: MemoDetail }) {
  return (
    <BlurFade direction="up" offset={16} duration={0.45}>
      <article className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
        <div className="flex items-center gap-space-8">
          <span
            className={`flex h-[26px] items-center rounded-full px-space-8 text-caption-sm ${labelClass[memo.label]}`}
          >
            {memo.category}
          </span>
          <span className="text-caption-sm text-text-muted">{memo.createdAt}</span>
        </div>
        <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
        <hr className="border-t border-border-default" />
        <div className="flex flex-col gap-space-12">
          {memo.blocks.map((block, i) => (
            <BlurFade key={i} direction="up" offset={8} delay={0.12 + i * 0.06}>
              <BodyBlock block={block} />
            </BlurFade>
          ))}
        </div>
      </article>
    </BlurFade>
  );
}
