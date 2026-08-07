const problems = [
  {
    id: "01",
    headline: "Global platforms, local problems.",
    body: "Stripe doesn't work here. PayPal withdrawals are blocked or frozen. Nigerian creators are left routing payments through workarounds that eat weeks and a percentage of every sale.",
  },
  {
    id: "02",
    headline: "Buyers don't trust download links.",
    body: "A link in a DM, a Google Drive folder, a Flutterwave page with no branding — buyers have been burned before. The moment they hesitate, the sale is gone.",
  },
  {
    id: "03",
    headline: "There is no local marketplace built for this.",
    body: "Gumroad is foreign. Selar exists but its reach is limited. There's no place designed from the ground up for Nigerian creators selling digital goods at Naira prices to Naira buyers.",
  },
];

export default function Problem() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-widest text-foreground/30 uppercase mb-12">
          The problem
        </p>

        <ul className="flex flex-col divide-y divide-border">
          {problems.map(({ id, headline, body }) => (
            <li key={id} className="py-10 flex flex-col sm:flex-row gap-6 sm:gap-10">
              <span
                aria-hidden
                className="font-mono text-xs text-foreground/20 shrink-0 pt-1 w-6"
              >
                {id}
              </span>

              <div className="flex flex-col gap-3">
                <h2 className="font-syne font-bold text-xl sm:text-2xl text-foreground leading-snug">
                  {headline}
                </h2>
                <p className="font-inter text-base text-foreground/55 leading-relaxed max-w-xl">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}