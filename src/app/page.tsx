import { Suspense } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { HomeMemos } from "@/components/HomeMemos";
import { MemoCount } from "@/components/HomeLists";
import { ReplayOnShow } from "@/components/ReplayOnShow";
import { BlurFade } from "@/components/ui/blur-fade";
import { TodayLabel } from "@/components/TodayLabel";
import { categories } from "@/data/memos";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-surface-page px-space-16 pt-space-64">
      <main className="flex flex-1 flex-col gap-space-16">
        <ReplayOnShow>
          <BlurFade direction="up" offset={12} duration={0.45}>
            <header className="flex flex-col gap-space-8 px-space-8">
              <p className="min-h-[22px] text-caption-md text-text-muted">
                <Suspense>
                  <TodayLabel />
                </Suspense>
              </p>
              <h1 className="text-heading-xl text-text-primary">
                오늘까지 메모를
                <br />
                <span className="text-primary">
                  <MemoCount />개
                </span> 남겼어요
              </h1>
            </header>
          </BlurFade>
          <BlurFade direction="up" offset={16} duration={0.45} delay={0.1} className="flex flex-col gap-space-16">
            <HomeMemos categories={categories} />
          </BlurFade>
        </ReplayOnShow>
      </main>
      <div className="sticky bottom-[0px] bg-surface-page pb-space-34 pt-space-16">
        <ButtonPrimary icon href="/write">
          새 메모 쓰기
        </ButtonPrimary>
      </div>
    </div>
  );
}
