import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBranding } from "@/lib/db";
import { isStaff } from "@/lib/types";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/chat");
  if (isStaff(session.role)) redirect("/admin/chat");

  const branding = await getBranding();
  if (!branding.showChat) redirect("/");

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-12 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Support
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide">
          Chat archive
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Message {branding.companyName} about rentals and quotes. Every thread
          grows into a permanent archive for your account.
        </p>
        <div className="mt-10">
          <ChatWorkspace mode="customer" user={session} />
        </div>
      </div>
    </div>
  );
}
