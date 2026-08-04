"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Branding, SessionUser } from "@/lib/types";
import { isStaff } from "@/lib/types";

export function Header({ branding }: { branding: Branding }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const isHome = pathname === "/";
  const isAuthShell =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/rent") ||
    pathname.startsWith("/chat");

  const links = branding.navItems.filter((item) => {
    if (!item.enabled) return false;
    if (item.href === "/#team" && !branding.showTeam) return false;
    if (item.href.includes("categories") && !branding.showGallery) return false;
    if (item.href === "/chat" && !branding.showChat) return false;
    return true;
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const light = !isHome || open;
  const logoH = branding.logoHeight || 44;

  return (
    <header
      className={cn(
        "z-50 transition-colors duration-300",
        isHome
          ? "absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent"
          : "sticky top-0 border-b border-stone-200/70 bg-[#f2f3f5]/90 backdrop-blur-xl",
        isAuthShell && "border-stone-800 bg-stone-950/95",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src={branding.logo}
            alt={branding.companyName}
            width={logoH}
            height={logoH}
            style={{ height: logoH, width: "auto" }}
            className="object-contain transition duration-300 group-hover:scale-[1.03]"
            priority
          />
          <div className="leading-none">
            <p
              className={cn(
                "font-display text-2xl tracking-[0.12em]",
                isHome || isAuthShell ? "text-white" : "text-stone-900",
              )}
            >
              {branding.companyName}
            </p>
            <p
              className={cn(
                "mt-1 text-[10px] uppercase tracking-[0.28em]",
                isHome || isAuthShell
                  ? "text-[var(--brand-primary)]"
                  : "text-amber-800",
              )}
            >
              {branding.regionLabel}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition",
                isHome || isAuthShell
                  ? "text-white/75 hover:text-white"
                  : "text-stone-600 hover:text-stone-950",
                pathname === link.href &&
                  (isHome || isAuthShell ? "text-amber-300" : "text-amber-700"),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={isStaff(user.role) ? "/admin" : "/dashboard"}
                className={cn(
                  "text-sm",
                  isHome || isAuthShell
                    ? "text-white/80 hover:text-white"
                    : "text-stone-700 hover:text-stone-950",
                )}
              >
                {isStaff(user.role) ? "Admin" : "My rentals"}
              </Link>
              <button
                onClick={logout}
                className={cn(
                  "rounded-sm border px-4 py-2 text-sm",
                  isHome || isAuthShell
                    ? "border-white/20 text-white/85 hover:bg-white/10"
                    : "border-stone-300 text-stone-700 hover:bg-stone-100",
                )}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "text-sm",
                  isHome || isAuthShell
                    ? "text-white/80 hover:text-white"
                    : "text-stone-700 hover:text-stone-950",
                )}
              >
                Log in
              </Link>
              <Link href="/rent" className="btn-primary !px-4 !py-2.5">
                {branding.ctaLabel}
              </Link>
            </>
          )}
        </div>

        <button
          className={cn(
            "rounded-sm border p-2 md:hidden",
            isHome || isAuthShell
              ? "border-white/20 text-white"
              : "border-stone-300 text-stone-800",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className={cn(
            "border-t px-5 py-6 md:hidden",
            light && !isAuthShell
              ? "border-stone-200 bg-[#f4f5f7]"
              : "border-white/10 bg-stone-950/95 text-white backdrop-blur",
          )}
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/rent"
              onClick={() => setOpen(false)}
              className="text-amber-600"
            >
              {branding.ctaLabel}
            </Link>
            {user ? (
              <>
                <Link
                  href={isStaff(user.role) ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                >
                  {isStaff(user.role) ? "Admin" : "My rentals"}
                </Link>
                <button onClick={logout} className="text-left opacity-70">
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
