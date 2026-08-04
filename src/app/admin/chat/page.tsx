import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/chat");
  if (!isStaff(session.role)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-12 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Link
          href="/admin"
          className="text-sm text-white/55 transition hover:text-white"
        >
          ← Admin home
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-amber-300">
          Support inbox
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide">
          Chat archive
        </h1>
        <p className="mt-3 text-white/60">
          Reply to customers. Full message history is kept as the archive grows.
        </p>
        <div className="mt-10">
          <ChatWorkspace mode="staff" user={session} />
        </div>
      </div>
    </div>
  );
}
