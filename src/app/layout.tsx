import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

export const metadata: Metadata = {
  title: "메모",
  description: "메모 앱",
  applicationName: "메모",
  appleWebApp: { capable: true, title: "메모", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#3182F6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
