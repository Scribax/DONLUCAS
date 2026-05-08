import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Providers } from "@/components/Providers";
import MainLayoutContent from "@/components/MainLayoutContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DON LUCAS | Huevos de Campo en San Rafael, Mendoza",
  description: "Venta de huevos de gallinas de campo frescos y naturales en San Rafael, Mendoza. Entrega a domicilio, calidad artesanal.",
  keywords: ["huevos de campo", "huevos San Rafael Mendoza", "huevos frescos", "maples de huevos san rafael", "granja familiar", "delivery de huevos"],
  openGraph: {
    title: "DON LUCAS | Huevos de Campo",
    description: "Frescos, naturales y entregados en tu casa en San Rafael, Mendoza.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative pb-16 md:pb-0">
        <Providers>
          <MainLayoutContent>
            {children}
          </MainLayoutContent>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
