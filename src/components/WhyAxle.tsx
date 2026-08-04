"use client";

import { motion } from "framer-motion";

const items = [
  {
    n: "01",
    title: "Site-ready fleet",
    body: "Machines maintained for civil works, mining support, and infrastructure—ready to mobilize.",
  },
  {
    n: "02",
    title: "Fast mobilization",
    body: "We protect your timeline with responsive delivery and clear rental coordination.",
  },
  {
    n: "03",
    title: "Operator support",
    body: "Optional certified operators and technical backup for the full hire period.",
  },
  {
    n: "04",
    title: "Project pricing",
    body: "Quotes negotiated to your scope, duration, and site conditions across Rwanda.",
  },
];

export function WhyAxle({ companyName }: { companyName: string }) {
  return (
    <section className="surface-grain relative overflow-hidden bg-[#e8eaee] py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-800">
            Why {companyName}
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-wide text-stone-900 md:text-6xl">
            Built to keep iron moving
          </h2>
          <p className="mt-4 max-w-xl text-stone-600">
            A rental partner that looks as sharp on site as it does online—
            reliable machines, clear process, serious delivery.
          </p>
        </div>

        <div className="mt-14 grid gap-px bg-stone-300/70 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="bg-[#e8eaee] p-7 transition hover:bg-white"
            >
              <p className="font-display text-3xl tracking-wider text-[var(--brand-primary)]">
                {item.n}
              </p>
              <h3 className="mt-6 font-display text-2xl tracking-wide text-stone-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
