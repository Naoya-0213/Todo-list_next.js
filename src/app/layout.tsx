import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SupabaseLisner } from "./components/supabase-lisner";

// google font(1)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// google font(2)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// google font(3)
const inter = Inter({ subsets: ["latin"] }); // inter を定義

// サイトタイトル＆説明
export const metadata: Metadata = {
  title: "Next.js Todo App",
  description: "学習用TODOリスト作成",
};

// ページ全体レイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="jp">
      <body className={inter.className}>
        {/* Navigationの表示（componets/Navigation.tsx は "use client"のため、直接呼べない！*/}
        <SupabaseLisner />

        {/* mainの内容表示（全体paga.tsxのreturn内容表示 */}
        <main>{children}</main>

        {/* footer表示 */}
        <footer className="py-5 fixed bottom-0 w-full bg-white">
          <div className="text-center text-sm">
            Copyright © All rights reserved | Naoya's Practice
          </div>
        </footer>
      </body>
    </html>
  );
}
