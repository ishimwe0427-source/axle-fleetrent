import type { Branding } from "@/lib/types";

export function BrandTheme({ branding }: { branding: Branding }) {
  const css = `
    :root {
      --brand-primary: ${branding.primaryColor};
      --brand-accent: ${branding.accentColor};
      --axle-amber: ${branding.primaryColor};
      --axle-steel: ${branding.accentColor};
    }
    ::selection {
      background: ${branding.primaryColor};
      color: ${branding.accentColor};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
