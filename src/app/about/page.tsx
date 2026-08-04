import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContent, getFleet } from "@/lib/db";
import { FleetCard } from "@/components/FleetCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "AXLE Inc. Ltd — earthmoving equipment rental in Rwanda since 2017.",
};

export default async function AboutPage() {
  const [content, fleet] = await Promise.all([getContent(), getFleet()]);

  return (
    <div className="bg-[#f4f5f7]">
      <div className="relative h-[48vh] min-h-[320px] overflow-hidden bg-stone-900">
        <Image
          src={content.aboutImage || "/fleet/about.png"}
          alt="AXLE heavy equipment fleet"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-950/55" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 lg:px-8">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
            About AXLE
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-white md:text-6xl">
            The accelerating force
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-stone-900">
          {content.aboutTitle}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-stone-600">
          {content.aboutBody}
        </p>
        <blockquote className="mt-10 border-l-4 border-amber-400 pl-5 text-xl leading-relaxed text-stone-800">
          We aim to be the company that provides all the necessary machines in
          sound mechanical and physical state at real competitive prices that
          sets our clients at a good competitive position with others.
        </blockquote>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {[
            "Brand-new earthmoving fleet",
            "Competitive hire rates",
            "Quality-checked machines",
            "Technical support on hire",
            "Site-ready delivery",
            "Mining to energy coverage",
          ].map((item) => (
            <div
              key={item}
              className="border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
            >
              {item}
            </div>
          ))}
        </div>
        <Link
          href="/rent"
          className="mt-10 inline-flex rounded-sm bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
        >
          Start a rental
        </Link>
      </div>

      <div className="border-t border-stone-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
            Our machines
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-stone-900">
            Equipment built for real sites
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.slice(0, 6).map((item, index) => (
              <FleetCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
