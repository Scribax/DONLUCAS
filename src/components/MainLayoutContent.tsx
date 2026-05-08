"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={`flex-1 flex flex-col ${!isHome && !isAdmin ? 'pt-20 lg:pt-24' : ''}`}>
        {children}
      </main>
    </>
  );
}
