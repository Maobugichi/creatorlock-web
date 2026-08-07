import "./globals.css";

import Script from "next/script";
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              var stored = localStorage.getItem('theme');
              if (stored === 'dark') {
                document.documentElement.classList.add('dark');
              } else if (stored === 'system') {
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', systemDark);
              }
            })();
          `}
        </Script>
      </head>
      <body>
        <Providers>{children}</Providers>
        <GlobalToasts />
      </body>
    </html>
  );
}