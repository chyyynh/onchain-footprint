import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghost Genesis - 鑄造你的鏈上靈魂",
  description: "基於鏈上足跡生成專屬 RPG 角色與背景故事 | Track and explore blockchain transactions with RPG character generation",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <span className="text-sm">👻</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ghost Genesis
          </span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/activity" className="text-sm font-medium hover:text-primary transition-colors">
            Activity
          </Link>
          <Link href="/character" className="text-sm font-medium hover:text-primary transition-colors">
            🎮 Character
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Header />
            <main>{props.children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
