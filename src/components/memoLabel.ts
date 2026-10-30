export type MemoLabel = "blue" | "green" | "orange" | "pink";

// 메모의 색 라벨: 홈의 아이콘 칸과 상세의 배지가 같은 색을 쓴다.
export const labelClass: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};
