const creatorItems = [
  "eBooks & written guides",
  "Online courses & video bundles",
  "Design templates & UI kits",
  "Music, beats & audio files",
  "Photography presets",
  "Code snippets & dev tools",
];

const buyerItems = [
  { text: "No account required" },
  { text: "Pay with card, bank transfer, or USSD" },
  { text: "Download key sent straight to your email" },
  { text: "Link expires after use — your purchase is protected", highlight: true },
  { text: "Receipt included with every order" },
];

export default function WhoItsFor() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest text-foreground/30 uppercase mb-4">
            Who it&apos;s for
          </p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-foreground leading-tight">
            Pick your side.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
          <div className="bg-surface p-8 sm:p-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-primary tracking-widest uppercase">
                Creators
              </span>
              <h3 className="font-syne font-bold text-2xl text-foreground leading-snug">
                You made something.
                <br />
                Now sell it.
              </h3>
              <p className="font-inter text-sm text-foreground/50 leading-relaxed mt-1">
                List your digital product in minutes. Set your Naira price. Get
                paid directly — no middleman holding your money.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {creatorItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="w-1 h-1 rounded-full bg-primary shrink-0"
                  />
                  <span className="font-inter text-sm text-foreground/70">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-border">
              <p className="font-mono text-xs text-foreground/25">
                Your store. Your price. Your payout.
              </p>
            </div>
          </div>

          <div className="bg-background p-8 sm:p-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-foreground/40 tracking-widest uppercase">
                Buyers
              </span>
              <h3 className="font-syne font-bold text-2xl text-foreground leading-snug">
                Find it.
                <br />
                Pay. Download.
              </h3>
              <p className="font-inter text-sm text-foreground/50 leading-relaxed mt-1">
                No registration wall. No waiting for a seller to manually send
                you a file. Pay and your download is in your inbox within
                seconds.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {buyerItems.map(({ text, highlight }) => (
                <li key={text} className="flex items-center gap-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                    className={`shrink-0 ${highlight ? "text-status-positive" : "text-foreground/30"}`}
                  >
                    <path
                      d="M2.5 7l3 3 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-inter text-sm text-foreground/70">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-border">
              <p className="font-mono text-xs text-foreground/25">
                In your inbox in under 60 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}