"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";

// 화면이 다시 나타날 때 안쪽 애니메이션을 처음부터 다시 재생한다.
// 이 앱은 다른 화면으로 가도 이전 화면의 상태를 유지하므로, 돌아왔을 때는 애니메이션이 이미 끝난 상태로 남는다.
// 화면이 숨겨질 때 키를 바꿔 두면 다시 보일 때 안쪽이 새로 만들어져 효과가 처음부터 나온다.
export function ReplayOnShow({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0);

  useEffect(() => () => setRun((n) => n + 1), []);

  return <Fragment key={run}>{children}</Fragment>;
}
