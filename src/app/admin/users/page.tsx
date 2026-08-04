import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listUsers } from "@/lib/db";
import { isSuperAdmin } from "@/lib/types";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/users");
  if (!isSuperAdmin(session.role)) redirect("/admin");

  const users = (await listUsers()).map(
    ({ passwordHash: _, ...safe }) => safe,
  );

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
          Users & roles
        </h1>
        <p className="mt-3 text-white/60">
          Promote company staff to admin, or keep clients as customers.
        </p>
        <div className="mt-10">
          <AdminUsersManager initial={users} />
        </div>
      </div>
    </div>
  );
}
