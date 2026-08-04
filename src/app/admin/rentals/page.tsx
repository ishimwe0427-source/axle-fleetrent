import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getFleet, getRentals, getUserById } from "@/lib/db";
import { AdminRentals } from "@/components/admin/AdminRentals";

export default async function AdminRentalsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/rentals");
  if (!isStaff(session.role)) redirect("/dashboard");

  const [rentals, fleet] = await Promise.all([getRentals(), getFleet()]);
  const enriched = await Promise.all(
    rentals.map(async (rental) => {
      const user = await getUserById(rental.userId);
      const machine = fleet.find((f) => f.id === rental.fleetId);
      return {
        ...rental,
        userName: user?.name || "Unknown",
        userEmail: user?.email || "",
        machineName: machine?.name || "Equipment",
      };
    }),
  );

  return (
    <div className="min-h-screen bg-stone-950 pb-24 pt-10 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Link href="/admin" className="text-sm text-amber-300 hover:underline">
          ← Admin home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-wide">
          Rental requests
        </h1>
        <p className="mt-2 text-white/60">
          Approve or activate a hire while the machine is on site — it becomes
          unavailable. Mark completed when the job finishes to free it again.
          Final prices stay negotiated with the client.
        </p>
        <div className="mt-10">
          <AdminRentals initial={enriched} />
        </div>
      </div>
    </div>
  );
}
