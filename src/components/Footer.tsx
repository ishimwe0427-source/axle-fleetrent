import Image from "next/image";
import Link from "next/link";
import type { Branding, SiteContent } from "@/lib/types";

export function Footer({
  content,
  branding,
}: {
  content: SiteContent;
  branding: Branding;
}) {
  const links = branding.navItems.filter((n) => n.enabled).slice(0, 6);

  return (
    <footer className="steel-mesh relative overflow-hidden text-white">
      <div className="absolute inset-0 opacity-25">
        <Image
          src="/fleet/hero.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-[#0d0f12]/92 to-[#0d0f12]/75" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={branding.logo}
              alt={branding.companyName}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <p className="font-display text-3xl tracking-[0.14em]">
              {branding.companyName}
            </p>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            {branding.footerText || content.tagline}
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-wider text-[var(--brand-primary)]">
            Explore
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-white/75">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/rent" className="transition hover:text-white">
                {branding.ctaLabel}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-wider text-[var(--brand-primary)]">
            Contact
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-white/75">
            <li>{content.address}</li>
            <li>
              <a
                href={`tel:${branding.supportPhone || content.phone}`}
                className="transition hover:text-white"
              >
                {branding.supportPhone || content.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${branding.supportEmail || content.email}`}
                className="transition hover:text-white"
              >
                {branding.supportEmail || content.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-5 py-5 text-center text-xs text-white/40 lg:px-8">
        © {new Date().getFullYear()} {branding.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
