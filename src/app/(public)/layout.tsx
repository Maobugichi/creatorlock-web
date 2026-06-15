import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CreatorLock — Turn what you know into what you earn.",
  description:
    "The Nigerian creator marketplace for selling digital goods. Naira-native pricing, instant Paystack settlement, secure time-limited downloads.",
  openGraph: {
    title: "CreatorLock",
    description: "Turn what you know into what you earn.",
    siteName: "CreatorLock",
    locale: "en_NG",
    type: "website",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}