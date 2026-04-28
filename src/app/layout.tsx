import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 智能拼豆像素化工具 - 图片转拼豆图纸",
  description: "将任意图片智能转换为拼豆像素图纸，支持 MARD、Hama 等主流品牌色库，AI 辅助配色，一键导出 PNG 图纸和材料清单。",
  keywords: ["拼豆", "像素画", "Perler Beads", "Fuse Beads", "像素化工具", "手工DIY", "图纸生成"],
  authors: [{ name: "AI Bead Tool" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23f97316'/><text x='16' y='22' text-anchor='middle' font-size='18' fill='white'>P</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
