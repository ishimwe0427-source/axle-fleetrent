import type { Metadata } from "next";
import { getContent } from "@/lib/db";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const content = await getContent();

  return (
    <div className="bg-[#f4f5f7] pb-24 pt-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
          Contact
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-stone-900 md:text-6xl">
          Talk to the rental desk
        </h1>
        <p className="mt-4 max-w-xl text-stone-600">
          Tell us the machine, site location, and hire window. Or{" "}
          <Link href="/rent" className="font-medium text-amber-700 underline">
            start a rental online
          </Link>
          .
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="border border-stone-200 bg-white p-6">
            <Phone className="h-6 w-6 text-amber-600" />
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl tracking-wide">
              Phone
            </h2>
            <a
              href={`tel:${content.phone}`}
              className="mt-2 block text-stone-600 hover:text-stone-900"
            >
              {content.phone}
            </a>
          </div>
          <div className="border border-stone-200 bg-white p-6">
            <Mail className="h-6 w-6 text-amber-600" />
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl tracking-wide">
              Email
            </h2>
            <a
              href={`mailto:${content.email}`}
              className="mt-2 block text-stone-600 hover:text-stone-900"
            >
              {content.email}
            </a>
          </div>
          <div className="border border-stone-200 bg-white p-6">
            <MapPin className="h-6 w-6 text-amber-600" />
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl tracking-wide">
              Location
            </h2>
            <p className="mt-2 text-stone-600">{content.address}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <div className="border border-stone-200 bg-stone-950 p-8 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-300">
              Prefer online booking?
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-wide">
              Create an account and request a machine in minutes
            </h2>
            <p className="mt-4 text-sm text-white/65">
              Clients can submit excavator, loader, bulldozer, compactor,
              grader, and Howo truck requests from the rental dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-sm bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="rounded-sm border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
