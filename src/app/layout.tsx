import type { Metadata } from "next";
import { Barlow_Condensed, Outfit } from "next/font/google";
import { headers } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandTheme } from "@/components/BrandTheme";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { PrivatePreview } from "@/components/PrivatePreview";
import { getBranding, getContent } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isSiteLive, isStaff } from "@/lib/types";
import "./globals.css";

export const dynamic = "force-dynamic";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBranding();
  return {
    title: {
      default: `${branding.legalName} — Machinery Rental`,
      template: `%s · ${branding.companyName}`,
    },
    description: branding.footerText || branding.tagline,
    icons: {
      icon: branding.favicon || "/favicon.png",
    },
  };
}

function isOpenPath(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/rent")
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [content, branding, session] = await Promise.all([
    getContent(),
    getBranding(),
    getSession(),
  ]);
  const pathname = (await headers()).get("x-pathname") || "";
  const live = isSiteLive(branding);
  const canSeePrivate =
    live || isOpenPath(pathname) || Boolean(session && isStaff(session.role));

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <BrandTheme branding={branding} />
        {canSeePrivate ? (
          <>
            <Header branding={branding} />
            <main className="flex-1">{children}</main>
            <Footer content={content} branding={branding} />
            {branding.showChat ? <ChatWidget /> : null}
          </>
        ) : (
          <PrivatePreview branding={branding} />
        )}
      </body>
    </html>
  );
}
