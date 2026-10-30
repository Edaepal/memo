import { connection } from "next/server";

export async function TodayLabel() {
  await connection();
  const today = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());

  return <>{today}</>;
}
