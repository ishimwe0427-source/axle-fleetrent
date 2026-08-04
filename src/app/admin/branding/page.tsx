import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBranding } from "@/lib/db";
import { isSuperAdmin } from "@/lib/types";
import { AdminBrandingManager } from "@/components/admin/AdminBrandingManager";

export const dynamic = "force-dynamic";

export default async function AdminBrandingPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/branding");
  if (!isSuperAdmin(session.role)) redirect("/admin");

  const branding = await getBranding();

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-12 text-white">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Link
          href="/admin"
          className="text-sm text-white/55 transition hover:text-white"
        >
          ← Admin home
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-amber-300">
          Super admin
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide">
          White-label branding
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Resell this platform to any company. Change logo, colors, navigation
          tabs, contact details, and which sections appear—without touching code.
        </p>
        <div className="mt-10">
          <AdminBrandingManager initial={branding} />
        </div>
      </div>
    </div>
  );
}
