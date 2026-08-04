import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTeamMember, teamMembers } from "@/lib/team";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return teamMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return { title: "Team" };
  return {
    title: `${member.name} · ${member.role}`,
    description: member.shortBio,
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();

  const others = teamMembers.filter((m) => m.slug !== member.slug);

  return (
    <div className="bg-[#f4f5f7] pb-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <div>
          <Link
            href="/#team"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to team
          </Link>

          <div className="relative mt-6 aspect-[3/4] overflow-hidden bg-stone-900">
            <Image
              src={member.image}
              alt={member.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 40vw"
            />
          </div>
        </div>

        <div className="lg:pt-10">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
            {member.role}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-stone-900 md:text-6xl">
            {member.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            {member.bio}
          </p>

          <div className="mt-8">
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-stone-900">
              Focus areas
            </h2>
            <ul className="mt-4 space-y-2">
              {member.focus.map((item) => (
                <li
                  key={item}
                  className="border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-stone-900">
              Connect
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#0A66C2] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#004182]"
                >
                  LinkedIn
                </a>
              )}
              {member.socials.facebook && (
                <a
                  href={member.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  Facebook
                </a>
              )}
              {member.socials.twitter && (
                <a
                  href={member.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  X / Twitter
                </a>
              )}
            </div>
          </div>

          <Link
            href="/contact"
            className="mt-10 inline-flex rounded-sm bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
          >
            Contact AXLE
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-stone-900">
          More from the team
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/team/${other.slug}`}
              className="group flex gap-4 border border-stone-200 bg-white p-4 transition hover:border-amber-400/60"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone-200">
                <Image
                  src={other.image}
                  alt={other.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-amber-700">
                  {other.role}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl tracking-wide text-stone-900 group-hover:text-amber-800">
                  {other.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                  {other.shortBio}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
