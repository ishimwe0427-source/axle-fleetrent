import type { Metadata } from "next";
import { FleetCard } from "@/components/FleetCard";
import { getBranding, getFleet } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fleet",
  description:
    "Rent excavators, wheel loaders, bulldozers, compactors, graders, and haul trucks.",
};

export default async function FleetPage() {
  const [fleet, branding] = await Promise.all([getFleet(), getBranding()]);
  const featured = fleet.find((f) => f.featured) || fleet[0];
  const rest = fleet.filter((f) => f.id !== featured?.id);

  return (
    <div className="surface-grain bg-[var(--background)] pb-24 pt-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-800">
          Equipment
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-wide text-stone-900 md:text-7xl">
          Fleet for hire
        </h1>
        <p className="mt-4 max-w-2xl text-stone-600">
          {branding.companyName} machines for mining, roads, quarries, and civil
          works. Prices are negotiated—book to request a quote.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {featured ? <FleetCard item={featured} index={0} featured /> : null}
          {rest.map((item, index) => (
            <FleetCard key={item.id} item={item} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
