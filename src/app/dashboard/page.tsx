import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaff } from "@/lib/types";
import { getFleet, getRentalsByUser, getUserById } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");
  if (isStaff(session.role)) redirect("/admin");

  const [rentals, fleet, user] = await Promise.all([
    getRentalsByUser(session.id),
    getFleet(),
    getUserById(session.id),
  ]);

  const fleetMap = Object.fromEntries(fleet.map((f) => [f.id, f]));

  return (
    <div className="bg-[#f4f5f7] pb-24 pt-12">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
              Client dashboard
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-stone-900 md:text-5xl">
              Welcome, {session.name.split(" ")[0]}
            </h1>
            <p className="mt-2 text-stone-600">
              {user?.company || "Personal account"} · {session.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="rounded-sm border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-white"
            >
              Support chat
            </Link>
            <Link
              href="/rent"
              className="rounded-sm bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
            >
              New rental request
            </Link>
          </div>
        </div>

        <div className="mt-12 overflow-hidden border border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-5 py-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide">
              Your rental requests
            </h2>
          </div>
          {rentals.length === 0 ? (
            <div className="px-5 py-12 text-center text-stone-500">
              No rentals yet.{" "}
              <Link href="/fleet" className="text-amber-700 underline">
                Browse the fleet
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {rentals.map((rental) => {
                const machine = fleetMap[rental.fleetId];
                return (
                  <li
                    key={rental.id}
                    className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-stone-900">
                        {machine?.name || "Equipment"}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {rental.startDate} → {rental.endDate} · {rental.location}
                      </p>
                    </div>
                    <span
                      className={`inline-flex w-fit rounded-sm px-3 py-1 text-xs uppercase tracking-wider ${
                        rental.status === "approved" || rental.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : rental.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
