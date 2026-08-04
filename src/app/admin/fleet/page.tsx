import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getFleet } from "@/lib/db";
import { AdminFleetManager } from "@/components/admin/AdminFleetManager";

export default async function AdminFleetPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/fleet");
  if (!isStaff(session.role)) redirect("/dashboard");

  const fleet = await getFleet();

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-10 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Link href="/admin" className="text-sm text-amber-300 hover:underline">
          ← Admin home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-wide">
          Fleet & images
        </h1>
        <p className="mt-2 text-white/60">
          Upload new machine photos and update names, rates, and descriptions.
        </p>
        <div className="mt-10">
          <AdminFleetManager initialFleet={fleet} />
        </div>
      </div>
    </div>
  );
}
