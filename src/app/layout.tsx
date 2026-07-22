import "./globals.css";

import Providers from "@/components/providers";
import { GlobalToasts } from "@/components/ui/globalToast";
import { Syne, Inter, Space_Mono } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <GlobalToasts/>
        </body>
    </html>
  );
}