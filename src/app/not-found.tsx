import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f4f5f7] px-5 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-amber-700">404</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-stone-900">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-stone-600">
        That route does not exist. Head back to the fleet or start a rental.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
        >
          Home
        </Link>
        <Link
          href="/fleet"
          className="rounded-sm border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-white"
        >
          View fleet
        </Link>
      </div>
    </div>
  );
}
