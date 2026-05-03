import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Dad Care Tracker",
  description: "Track care needs, doctor updates, vitals, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-[100dvh] flex flex-col">
          <Header />
          <main className="flex-1 pb-28 px-5 pt-5 max-w-xl mx-auto w-full">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
