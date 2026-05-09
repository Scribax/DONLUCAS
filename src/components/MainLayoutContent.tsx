"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

export default function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className={`flex-1 flex flex-col ${!isHome && !isAdmin ? 'pt-20 lg:pt-24' : ''}`}>
        {children}
      </main>
    </>
  );
}
