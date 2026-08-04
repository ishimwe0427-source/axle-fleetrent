import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff, isSuperAdmin } from "@/lib/types";
import {
  getCategories,
  getChatThreads,
  getFleet,
  getRentals,
  getSlides,
} from "@/lib/db";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (!isStaff(session.role)) redirect("/dashboard");

  const [fleet, rentals, slides, categories, threads] = await Promise.all([
    getFleet(),
    getRentals(),
    getSlides(),
    getCategories(),
    getChatThreads(),
  ]);
  const pending = rentals.filter((r) => r.status === "pending").length;
  const openChats = threads.filter((t) => t.status === "open").length;

  const cards = [
    {
      href: "/admin/slides",
      title: "Hero slides",
      body: `${slides.length} homepage slides. Change pictures and captions.`,
    },
    {
      href: "/admin/gallery",
      title: "Category galleries",
      body: `${categories.length} categories with photo galleries.`,
    },
    {
      href: "/admin/fleet",
      title: "Fleet & guide rates",
      body: `${fleet.length} machines. Photos, specs, and internal guide rates.`,
    },
    {
      href: "/admin/content",
      title: "Site content",
      body: "About copy, contact details, and marketing text.",
    },
    {
      href: "/admin/rentals",
      title: "Rental requests",
      body: `${pending} pending · ${rentals.length} total requests.`,
    },
    {
      href: "/admin/chat",
      title: "Support chat",
      body: `${openChats} open · ${threads.length} conversations in archive.`,
    },
  ];

  if (isSuperAdmin(session.role)) {
    cards.unshift(
      {
        href: "/admin/branding",
        title: "White-label branding",
        body: "Logo, colors, nav tabs, company name—rebrand for each client.",
      },
      {
        href: "/admin/users",
        title: "Users & roles",
        body: "Promote staff admins and manage customer accounts.",
      },
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-12 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          {isSuperAdmin(session.role) ? "Super admin" : "Admin dashboard"}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide">
          Control center
        </h1>
        <p className="mt-3 text-white/60">
          Signed in as {session.name}. Manage fleet, content, rentals, and
          support.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="border border-white/10 bg-white/5 p-6 transition hover:border-amber-400/50 hover:bg-white/[0.08]"
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-amber-300">
                {card.title}
              </h2>
              <p className="mt-3 text-sm text-white/65">{card.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
