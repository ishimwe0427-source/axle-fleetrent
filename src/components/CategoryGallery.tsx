"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { GalleryCategory } from "@/lib/types";

export function CategoryGallery({
  categories,
}: {
  categories: GalleryCategory[];
}) {
  const [featured, ...rest] = categories;

  return (
    <section className="steel-mesh py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
            By category
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-wide md:text-6xl">
            Machines by class
          </h2>
          <p className="mt-4 text-white/65">
            Open a category for the full photo set—earthmoving through haulage.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group relative lg:col-span-7"
            >
              <Link href={`/gallery/${featured.slug}`} className="block">
                <div className="relative aspect-[16/11] overflow-hidden bg-stone-800 lg:aspect-[5/4]">
                  <Image
                    src={featured.coverImage}
                    alt={featured.name}
                    fill
                    className="object-cover transition duration-[900ms] group-hover:scale-[1.05]"
                    sizes="(max-width:1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-primary)]">
                      {featured.images.length} photos
                    </p>
                    <h3 className="mt-2 font-display text-3xl tracking-wide md:text-5xl">
                      {featured.name}
                    </h3>
                    <p className="mt-3 max-w-md text-sm text-white/70">
                      {featured.description}
                    </p>
                    <span className="mt-5 inline-flex text-xs uppercase tracking-[0.2em] text-white">
                      View gallery →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((category, index) => (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                className="group"
              >
                <Link href={`/gallery/${category.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-800 lg:aspect-[21/9]">
                    <Image
                      src={category.coverImage}
                      alt={category.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width:1024px) 50vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                        {category.images.length} photos
                      </p>
                      <h3 className="mt-1 font-display text-2xl tracking-wide">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
