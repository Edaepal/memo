import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const className =
  "flex size-[40px] shrink-0 items-center justify-center rounded-sm text-text-primary";

// 켜진 상태(고정 등)는 파란 배경과 글자색으로 보인다.
const activeClassName =
  "flex size-[40px] shrink-0 items-center justify-center rounded-sm bg-label-blue-soft text-primary";

export function IconButton({
  label,
  active,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={active ? activeClassName : className}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}
