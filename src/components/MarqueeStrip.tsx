"use client";

export function MarqueeStrip({ items }: { items: string[] }) {
  const loop = [...items, ...items];

  return (
    <section className="border-y border-stone-200/80 bg-white py-4">
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-10 text-[11px] uppercase tracking-[0.28em] text-stone-500"
            >
              <span>{item}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--brand-primary)]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
