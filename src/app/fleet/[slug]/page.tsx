import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFleetBySlug } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { MachineBookingForm } from "@/components/MachineBookingForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getFleetBySlug(slug);
  if (!item) return { title: "Equipment" };
  return {
    title: item.name,
    description: item.tagline,
  };
}

export default async function FleetDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getFleetBySlug(slug);
  if (!item) notFound();
  const session = await getSession();

  return (
    <div className="bg-[#f4f5f7] pb-24">
      <div className="relative h-[52vh] min-h-[360px] overflow-hidden bg-stone-900">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
              {item.category}
            </p>
            <span
              className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${
                item.available
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {item.available ? "Available" : "On hire"}
            </span>
          </div>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-white md:text-6xl">
            {item.name}
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">{item.tagline}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.35fr_0.9fr] lg:px-8">
        <div>
          <div className="relative mb-8 aspect-[16/10] overflow-hidden border border-stone-200 bg-stone-200">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 55vw"
            />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="bg-stone-950/75 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-300">
                {item.category}
              </span>
              <span
                className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white ${
                  item.available ? "bg-emerald-600" : "bg-red-600"
                }`}
              >
                {item.available ? "Available" : "On hire"}
              </span>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
            Machine details
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-wide text-stone-900 md:text-4xl">
            {item.name}
          </h2>
          <p className="mt-2 text-stone-500">{item.tagline}</p>
          <p className="mt-5 text-base leading-relaxed text-stone-600">
            {item.description}
          </p>

          <h3 className="mt-10 font-[family-name:var(--font-display)] text-xl tracking-wide text-stone-900">
            Specifications
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {item.specs.map((spec) => (
              <div
                key={spec.label}
                className="border border-stone-200 bg-white p-5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                  {spec.label}
                </p>
                <p className="mt-2 font-medium text-stone-900">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-stone-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-700">
              Pricing
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              AXLE negotiates hire rates per project, site conditions, duration,
              and operator needs. Submit a booking request and our team will
              confirm availability with a competitive quote.
            </p>
          </div>
        </div>

        <MachineBookingForm machine={item} isLoggedIn={Boolean(session)} />
      </div>
    </div>
  );
}
