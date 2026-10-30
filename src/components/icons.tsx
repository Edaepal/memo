import type { SVGProps } from "react";

// 선 아이콘. 색은 currentColor라서 부모의 글자색을 따른다.
function Icon({ size, children, ...props }: SVGProps<SVGSVGElement> & { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconPlus() {
  return (
    <Icon size={20} strokeWidth={1.66667}>
      <path d="M10 4.16667V10M10 10V15.8333M10 10H4.16667M10 10H15.8333" />
    </Icon>
  );
}

export function IconNote() {
  return (
    <Icon size={22} strokeWidth={1.83333}>
      <path d="M6.41667 3.66667H12.8333L16.5 7.33333V18.3333H6.41667V3.66667Z" />
      <path d="M12.8333 3.66667V7.33333H16.5M9.16667 11H13.75M9.16667 14.6667H13.75" />
    </Icon>
  );
}

export function IconPin() {
  return (
    <Icon size={16} strokeWidth={1.33333}>
      <path d="M6 2.33333H10L9.4 5.8L11.3333 8H4.66667L6.6 5.8L6 2.33333Z" />
      <path d="M8 8V13.3333" />
    </Icon>
  );
}

export function IconChevronRight() {
  return (
    <Icon size={16} strokeWidth={1.33333}>
      <path d="M6 4L10 8L6 12" />
    </Icon>
  );
}

export function IconChevronLeft() {
  return (
    <Icon size={24} strokeWidth={2}>
      <path d="M15 18L9 12L15 6" />
    </Icon>
  );
}

export function IconPinLarge() {
  return (
    <Icon size={24} strokeWidth={2}>
      <path d="M9 3.5H15L14.1 8.7L17 12H7L9.9 8.7L9 3.5Z" />
      <path d="M12 12V20" />
    </Icon>
  );
}

export function IconShare() {
  return (
    <Icon size={24} strokeWidth={2}>
      <path d="M12 4V15M16 8L12 4L8 8M5 14V18C5 18.5304 5.21071 19.0391 5.58579 19.4142C5.96086 19.7893 6.46957 20 7 20H17C17.5304 20 18.0391 19.7893 18.4142 19.4142C18.7893 19.0391 19 18.5304 19 18V14" />
    </Icon>
  );
}

export function IconMore() {
  return (
    <Icon size={24} fill="currentColor" stroke="none">
      <circle cx="5.5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18.5" cy="12" r="1.6" />
    </Icon>
  );
}
