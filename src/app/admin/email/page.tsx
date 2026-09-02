import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getEmailLogs, getMailSettings } from "@/lib/db";
import { getResolvedMailSettings, mailIsReady } from "@/lib/mail";
import { AdminEmailManager } from "@/components/admin/AdminEmailManager";

export const dynamic = "force-dynamic";

export default async function AdminEmailPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/email");
  if (!isStaff(session.role)) redirect("/dashboard");

  const [settings, logs, resolved] = await Promise.all([
    getMailSettings(),
    getEmailLogs(50),
    getResolvedMailSettings(),
  ]);

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-12 text-white">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Link href="/admin" className="text-sm text-white/55 hover:text-white">
          ← Admin home
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-amber-300">
          Operations
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-wide">
          Official email
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          When a client books a machine, they immediately receive a confirmation
          on the email they registered with. Status changes from this panel send
          another official update.
        </p>
        <div className="mt-10">
          <AdminEmailManager
            initial={{ ...settings, pass: settings.pass ? "••••••••" : "" }}
            configured={mailIsReady(resolved)}
            logs={logs}
          />
        </div>
      </div>
    </div>
  );
}
