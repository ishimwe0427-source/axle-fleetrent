import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getSlides } from "@/lib/db";
import { AdminSlidesManager } from "@/components/admin/AdminSlidesManager";

export default async function AdminSlidesPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/slides");
  if (!isStaff(session.role)) redirect("/dashboard");

  const slides = await getSlides();

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-10 text-white">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Link href="/admin" className="text-sm text-amber-300 hover:underline">
          ← Admin home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-wide">
          Hero slides
        </h1>
        <p className="mt-2 text-white/60">
          Manage the 3 homepage slider pictures, titles, and subtitles.
        </p>
        <div className="mt-10">
          <AdminSlidesManager initialSlides={slides} />
        </div>
      </div>
    </div>
  );
}
