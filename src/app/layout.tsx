import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

export const metadata: Metadata = {
  title: "메모",
  description: "메모 앱",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
