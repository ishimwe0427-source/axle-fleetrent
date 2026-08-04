"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { TeamMember } from "@/lib/team";

export function TeamSection({
  members,
  companyName,
}: {
  members: TeamMember[];
  companyName: string;
}) {
  return (
    <section className="surface-grain bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-800">
              Our team
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-wide text-stone-900 md:text-6xl">
              The people behind {companyName}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-stone-600">
            Leadership across fleet strategy, finance, and site operations.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <motion.article
              key={member.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Link href={`/team/${member.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition duration-[900ms] group-hover:scale-[1.04] group-hover:saturate-110"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-primary)]">
                      {member.role}
                    </p>
                    <h3 className="mt-2 font-display text-2xl tracking-wide text-white md:text-3xl">
                      {member.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/70">
                      {member.shortBio}
                    </p>
                    <span className="mt-4 inline-flex text-xs uppercase tracking-[0.18em] text-white/90 transition group-hover:translate-x-1">
                      View profile →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
