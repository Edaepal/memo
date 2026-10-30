import { Suspense } from "react";
import { EditMemo } from "@/components/EditMemo";

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditMemo id={id} />;
}

export default function EditMemoPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <Editor params={params} />
    </Suspense>
  );
}
