import { Suspense } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { IconButton, IconLink } from "@/components/IconButton";
import { IconChevronLeft, IconMore, IconPinLarge, IconShare } from "@/components/icons";
import { PinButton } from "@/components/PinButton";
import { SavedMemoArticle } from "@/components/SavedMemoArticle";

async function MemoArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SavedMemoArticle id={id} />;
}

export default function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-surface-page px-space-16 pt-space-48">
      <header className="flex items-center justify-between">
        <IconLink label="홈으로 돌아가기" href="/">
          <IconChevronLeft />
        </IconLink>
        <div className="flex">
          <Suspense
            fallback={
              <IconButton label="고정" disabled>
                <IconPinLarge />
              </IconButton>
            }
          >
            <PinButton params={params} />
          </Suspense>
          <IconButton label="공유">
            <IconShare />
          </IconButton>
          <IconButton label="더보기">
            <IconMore />
          </IconButton>
        </div>
      </header>
      <main className="mt-space-16 flex flex-1 flex-col">
        <Suspense>
          <MemoArticle params={params} />
        </Suspense>
      </main>
      <div className="sticky bottom-0 bg-surface-page pb-space-34 pt-space-16">
        <ButtonPrimary tone="edit">수정하기</ButtonPrimary>
      </div>
    </div>
  );
}
