import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFleet } from "@/lib/db";
import { RentForm } from "@/components/RentForm";

type Props = { searchParams: Promise<{ machine?: string }> };

export default async function RentPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/rent");
  }

  const params = await searchParams;
  const fleet = await getFleet();

  return (
    <div className="bg-stone-950 pb-24 pt-10 text-white">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Rental request
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide">
          Book your machine
        </h1>
        <p className="mt-4 text-white/65">
          Signed in as {session.name}. Pick equipment, dates, and site location.
          Our team will confirm availability.
        </p>
        <div className="mt-10">
          <RentForm fleet={fleet} initialSlug={params.machine} />
        </div>
      </div>
    </div>
  );
}
