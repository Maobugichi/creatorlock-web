import AppShell from "@/components/layout/appShell";

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <AppShell navMode="auto">{children}</AppShell>;
}