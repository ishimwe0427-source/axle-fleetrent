import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getCategories } from "@/lib/db";
import { AdminGalleryManager } from "@/components/admin/AdminGalleryManager";

export default async function AdminGalleryPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/gallery");
  if (!isStaff(session.role)) redirect("/dashboard");

  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-10 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Link href="/admin" className="text-sm text-amber-300 hover:underline">
          ← Admin home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-wide">
          Category galleries
        </h1>
        <p className="mt-2 text-white/60">
          Edit category covers, add photos, and control “View more” galleries.
        </p>
        <div className="mt-10">
          <AdminGalleryManager initialCategories={categories} />
        </div>
      </div>
    </div>
  );
}
