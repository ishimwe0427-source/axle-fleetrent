import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getContent } from "@/lib/db";
import { AdminContentEditor } from "@/components/admin/AdminContentEditor";

export default async function AdminContentPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/content");
  if (!isStaff(session.role)) redirect("/dashboard");

  const content = await getContent();

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-10 text-white">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Link href="/admin" className="text-sm text-amber-300 hover:underline">
          ← Admin home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-wide">
          Site content
        </h1>
        <p className="mt-2 text-white/60">
          Edit homepage copy, about text, contact info, and hero imagery.
        </p>
        <div className="mt-10">
          <AdminContentEditor initial={content} />
        </div>
      </div>
    </div>
  );
}
