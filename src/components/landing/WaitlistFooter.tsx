export default function WaitlistFooter() {
  return (
    <footer className="bg-surface border-t border-border px-6 py-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-syne font-bold text-sm text-foreground">
          CreatorLock
        </span>

        <nav aria-label="Footer" className="flex items-center gap-6">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "FAQ", href: "#faq" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-inter text-xs text-foreground/40 hover:text-foreground/70 transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

        <span className="font-mono text-xs text-foreground/20">
          © {new Date().getFullYear()} CreatorLock · Built in Nigeria 🇳🇬
        </span>
      </div>
    </footer>
  );
}