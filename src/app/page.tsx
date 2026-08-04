import { HeroSlider } from "@/components/HeroSlider";
import { FleetCard } from "@/components/FleetCard";
import { CategoryGallery } from "@/components/CategoryGallery";
import { WhyAxle } from "@/components/WhyAxle";
import { AboutPreview } from "@/components/AboutPreview";
import { TeamSection } from "@/components/TeamSection";
import { CtaBand } from "@/components/CtaBand";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { Reveal } from "@/components/ui/Reveal";
import {
  getBranding,
  getCategories,
  getContent,
  getFleet,
  getSlides,
} from "@/lib/db";
import { teamMembers } from "@/lib/team";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, fleet, slides, categories, branding] = await Promise.all([
    getContent(),
    getFleet(),
    getSlides(),
    getCategories(),
    getBranding(),
  ]);

  const featured = fleet.find((f) => f.featured) || fleet[0];
  const rest = fleet.filter((f) => f.id !== featured?.id);
  const marqueeItems = [
    branding.regionLabel,
    branding.tagline,
    ...fleet.map((f) => f.name),
    "Negotiate per project",
  ];

  return (
    <>
      <HeroSlider
        slides={slides}
        fallbackTitle={content.heroTitle}
        fallbackSubtitle={content.heroSubtitle}
        companyName={branding.companyName}
        ctaLabel={branding.ctaLabel}
      />

      <MarqueeStrip items={marqueeItems} />

      <section className="surface-grain bg-[var(--background)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-amber-800">
                The fleet
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-wide text-stone-900 md:text-6xl">
                Machines ready to mobilize
              </h2>
              <p className="mt-4 text-stone-600">
                A growing catalog for mining, roads, quarries, and civil works.
                Request a booking—pricing is negotiated for your project.
              </p>
            </div>
            <Link
              href="/fleet"
              className="text-sm font-semibold tracking-wide text-stone-900 underline decoration-[var(--brand-primary)] underline-offset-8 transition hover:text-amber-800"
            >
              Full catalog →
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
            {featured ? (
              <FleetCard item={featured} index={0} featured />
            ) : null}
            {rest.map((item, index) => (
              <FleetCard key={item.id} item={item} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {branding.showGallery ? (
        <div id="categories">
          <CategoryGallery categories={categories} />
        </div>
      ) : null}

      <WhyAxle companyName={branding.companyName} />

      <AboutPreview
        title={content.aboutTitle}
        body={content.aboutBody}
        image={content.aboutImage}
      />

      {branding.showTeam ? (
        <div id="team">
          <TeamSection
            members={teamMembers}
            companyName={branding.companyName}
          />
        </div>
      ) : null}

      <CtaBand ctaLabel={branding.ctaLabel} />
    </>
  );
}
