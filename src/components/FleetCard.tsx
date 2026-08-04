"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { FleetItem } from "@/lib/types";

export function FleetCard({
  item,
  index = 0,
  featured = false,
}: {
  item: FleetItem;
  index?: number;
  featured?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={featured ? "lg:col-span-2 lg:row-span-2" : undefined}
    >
      <Link
        href={`/fleet/${item.slug}`}
        className="group relative block h-full overflow-hidden bg-stone-900"
      >
        <div
          className={`relative overflow-hidden ${
            featured ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[540px]" : "aspect-[5/4]"
          }`}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition duration-[900ms] ease-out group-hover:scale-[1.06]"
            sizes={
              featured
                ? "(max-width:1024px) 100vw, 66vw"
                : "(max-width:768px) 100vw, 33vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-95" />
          <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(245,166,35,0.18),transparent_45%)]" />

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em]">
              <span className="text-[var(--brand-primary)]">{item.category}</span>
              <span className="text-white/30">/</span>
              <span className={item.available ? "text-emerald-300" : "text-rose-300"}>
                {item.available ? "Available" : "On hire"}
              </span>
            </div>
            <h3
              className={`mt-3 font-display tracking-wide text-white ${
                featured ? "text-3xl md:text-5xl" : "text-2xl md:text-[1.7rem]"
              }`}
            >
              {item.name}
            </h3>
            <p
              className={`mt-2 leading-relaxed text-white/70 ${
                featured ? "max-w-md text-base" : "line-clamp-2 text-sm"
              }`}
            >
              {item.tagline}
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)] transition group-hover:translate-x-1">
              {item.available ? "Negotiate & book →" : "View machine →"}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
