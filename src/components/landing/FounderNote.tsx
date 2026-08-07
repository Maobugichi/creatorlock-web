export default function FounderNote() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-widest text-foreground/30 uppercase mb-12">
          From the founder
        </p>

        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 flex flex-col gap-10">
          <span aria-hidden className="font-syne text-6xl text-primary/20 leading-none select-none">
            &quot;
          </span>

          <div className="flex flex-col gap-5 -mt-6">
            <p className="font-inter text-base sm:text-lg text-foreground/80 leading-relaxed">
              I built this because I kept watching Nigerian creators lose sales
              to broken payment links, WhatsApp DMs gone cold, and Google Drive
              folders that got reported and taken down. The work was good. The
              distribution was the problem.
            </p>
            <p className="font-inter text-base sm:text-lg text-foreground/80 leading-relaxed">
              Every tool I found was built for someone else — a US creator with
              a Stripe account, a European freelancer with a PayPal. If you&apos;re
              selling in Naira to Nigerians, you&apos;re an afterthought. CreatorLock
              is built the other way around.
            </p>
            <p className="font-inter text-base sm:text-lg text-foreground/80 leading-relaxed">
              We&apos;re early. There&apos;s a lot still to build. But the core is right:
              upload your product, set your price, get paid. That part works
              today.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="font-syne font-bold text-sm text-primary">F</span>
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-bold text-sm text-foreground">
                Maobugichi
              </span>
              <span className="font-mono text-xs text-foreground/30">
                Founder, CreatorLock · Lagos
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}