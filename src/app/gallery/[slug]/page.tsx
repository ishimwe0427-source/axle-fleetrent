import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
  getFleetByCategoryName,
} from "@/lib/db";
import { FleetCard } from "@/components/FleetCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Gallery" };
  return {
    title: `${category.name} gallery`,
    description: category.description,
  };
}

export default async function GalleryCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [machines, allCategories] = await Promise.all([
    getFleetByCategoryName(category.name),
    getCategories(),
  ]);

  return (
    <div className="bg-[#f4f5f7] pb-24">
      <div className="relative h-[42vh] min-h-[300px] overflow-hidden bg-stone-900">
        <Image
          src={category.coverImage}
          alt={category.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-950/55" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 lg:px-8">
          <Link
            href="/#categories"
            className="text-sm text-white/70 hover:text-white"
          >
            ← All categories
          </Link>
          <p className="mt-4 text-xs uppercase tracking-[0.28em] text-amber-300">
            Category gallery
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-white md:text-6xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">{category.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={`relative overflow-hidden bg-stone-200 ${
                index % 5 === 0 ? "sm:col-span-2 sm:aspect-[16/10]" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={image}
                alt={`${category.name} photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {machines.length > 0 && (
          <div className="mt-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-stone-900">
              Rent this class
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {machines.map((item, index) => (
                <FleetCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-stone-900">
            Other categories
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {allCategories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/gallery/${c.slug}`}
                  className="border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 hover:border-amber-400"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
