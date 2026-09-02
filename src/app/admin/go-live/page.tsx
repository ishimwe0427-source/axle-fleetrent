import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBranding } from "@/lib/db";
import { isSiteLive, isSuperAdmin } from "@/lib/types";
import { GoLiveControl } from "@/components/admin/GoLiveControl";

export const dynamic = "force-dynamic";

export default async function GoLivePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/go-live");
  if (!isSuperAdmin(session.role)) redirect("/admin");

  const branding = await getBranding();
  const env = process.env.SITE_PUBLISHED;
  const envLocked = env === "true" || env === "false";

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-12 text-white">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Link href="/admin" className="text-sm text-white/55 hover:text-white">
          ← Admin home
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-amber-300">
          Super admin
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-wide">
          Go live
        </h1>
        <p className="mt-3 text-white/60">
          Hide the public website until the company owner approves it. When you
          are ready, click here to put it online.
        </p>
        <div className="mt-10">
          <GoLiveControl
            published={isSiteLive(branding)}
            envLocked={envLocked}
          />
        </div>
      </div>
    </div>
  );
}
