import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { IconPlus } from "./icons";

type ButtonPrimaryProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: boolean;
  href?: string;
  // primary: 기본 파란 버튼, edit: 수정하기처럼 편집으로 들어가는 버튼
  tone?: "primary" | "edit";
};

const baseClassName =
  "flex h-[56px] w-full items-center justify-center gap-space-8 rounded-md px-space-24 text-button-md text-text-on-primary";

const toneClassName = { primary: "bg-primary", edit: "bg-edit" };

export function ButtonPrimary({
  icon = false,
  href,
  tone = "primary",
  children,
  ...props
}: ButtonPrimaryProps) {
  const className = `${baseClassName} ${toneClassName[tone]}`;
  const content = (
    <>
      {icon && <IconPlus />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} {...props}>
      {content}
    </button>
  );
}
