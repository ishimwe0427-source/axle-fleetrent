import bcrypt from "bcryptjs";
import type { Database } from "./types";

const now = new Date().toISOString();

export async function createSeedDatabase(): Promise<Database> {
  const ownerEmail =
    process.env.SUPERADMIN_EMAIL || "owner@fleetrent.pro";
  const ownerPassword =
    process.env.SUPERADMIN_PASSWORD || "ChangeMeNow!2026";
  const ownerHash = await bcrypt.hash(ownerPassword, 12);

  return {
    users: [
      {
        id: "user_superadmin",
        name: "Platform Owner",
        email: ownerEmail,
        phone: "+250 700 000 000",
        passwordHash: ownerHash,
        role: "superadmin",
        company: "FleetRent Platform",
        createdAt: now,
      },
    ],
    fleet: [
      {
        id: "fleet_excavator",
        slug: "excavator",
        name: "Excavator Machine",
        category: "Earthmoving",
        tagline: "Precision digging for foundations, trenches, and mining pits.",
        description:
          "Our excavators are maintained to peak condition for civil works, mining support, and infrastructure projects across Rwanda. Ideal for excavation, loading, and demolition support with operator-ready delivery.",
        image: "/fleet/excavator.png",
        dailyRate: 450000,
        weeklyRate: 2700000,
        monthlyRate: 9000000,
        available: true,
        featured: true,
        specs: [
          { label: "Operating weight", value: "20–25 tons" },
          { label: "Bucket capacity", value: "1.0–1.2 m³" },
          { label: "Reach", value: "Up to 10 m" },
          { label: "Operator", value: "Optional certified operator" },
        ],
        updatedAt: now,
      },
      {
        id: "fleet_wheel_loader",
        slug: "wheel-loader",
        name: "Wheel Loader Machine",
        category: "Loading",
        tagline: "Fast material handling for stockpiles, sand, and aggregates.",
        description:
          "Wheel loaders built for high-cycle loading on construction and quarry sites. Move aggregates, soil, and debris with stable traction and reliable hydraulic power.",
        image: "/fleet/wheel-loader.png",
        dailyRate: 380000,
        weeklyRate: 2280000,
        monthlyRate: 7600000,
        available: true,
        featured: true,
        specs: [
          { label: "Bucket capacity", value: "2.5–3.5 m³" },
          { label: "Engine power", value: "160–200 HP" },
          { label: "Drive", value: "4WD articulated" },
          { label: "Best for", value: "Quarries & road works" },
        ],
        updatedAt: now,
      },
      {
        id: "fleet_bulldozer",
        slug: "bulldozer",
        name: "Bulldozer Machine",
        category: "Earthmoving",
        tagline: "Raw pushing power for land clearing and site leveling.",
        description:
          "Heavy-duty bulldozers for clearing, grading prep, and pushing fill material. A core machine for large site preparation and mining access roads.",
        image: "/fleet/bulldozer.png",
        dailyRate: 520000,
        weeklyRate: 3120000,
        monthlyRate: 10400000,
        available: true,
        featured: true,
        specs: [
          { label: "Blade type", value: "Straight / semi-U" },
          { label: "Track system", value: "Heavy-duty undercarriage" },
          { label: "Push capacity", value: "High-volume fill" },
          { label: "Terrain", value: "Rough & soft ground" },
        ],
        updatedAt: now,
      },
      {
        id: "fleet_compactor",
        slug: "compactor",
        name: "Compactor Machine",
        category: "Compaction",
        tagline: "Dense, stable ground for roads and foundations.",
        description:
          "Soil and asphalt compactors that deliver consistent density for roads, pads, and embankments. Keep your base layers tight and project timelines on track.",
        image: "/fleet/compactor.png",
        dailyRate: 280000,
        weeklyRate: 1680000,
        monthlyRate: 5600000,
        available: true,
        featured: true,
        specs: [
          { label: "Drum type", value: "Smooth / padfoot" },
          { label: "Compaction force", value: "High amplitude" },
          { label: "Width", value: "Road-ready coverage" },
          { label: "Use cases", value: "Roads, pads, embankments" },
        ],
        updatedAt: now,
      },
      {
        id: "fleet_grader",
        slug: "grader",
        name: "Grader Machine",
        category: "Grading",
        tagline: "Fine grading accuracy for roads and drainage profiles.",
        description:
          "Motor graders for finishing road surfaces, shaping shoulders, and maintaining access roads. Precision blade control for smooth, professional results.",
        image: "/fleet/grader.png",
        dailyRate: 400000,
        weeklyRate: 2400000,
        monthlyRate: 8000000,
        available: true,
        featured: true,
        specs: [
          { label: "Blade length", value: "3.7–4.3 m" },
          { label: "Finish quality", value: "Survey-grade leveling" },
          { label: "Applications", value: "Roads & drainage" },
          { label: "Mobility", value: "Site-to-site ready" },
        ],
        updatedAt: now,
      },
      {
        id: "fleet_howo",
        slug: "howo-trucks",
        name: "Howo Trucks",
        category: "Haulage",
        tagline: "Reliable dump trucks for aggregate and spoil haulage.",
        description:
          "Howo (Woho) dump trucks for moving soil, sand, gravel, and construction spoil. Strong haulage capacity for mining, construction, and municipal works across Rwanda.",
        image: "/fleet/howo-truck.png",
        dailyRate: 220000,
        weeklyRate: 1320000,
        monthlyRate: 4400000,
        available: true,
        featured: true,
        specs: [
          { label: "Body type", value: "Tipper / dump" },
          { label: "Payload", value: "High-tonnage haulage" },
          { label: "Fleet size", value: "Multiple units available" },
          { label: "Sectors", value: "Mining & construction" },
        ],
        updatedAt: now,
      },
    ],
    rentals: [],
    content: {
      heroTitle: "Heavy equipment. Delivered to your site.",
      heroSubtitle:
        "AXLE rents excavators, loaders, bulldozers, compactors, graders, and Howo trucks for mining, construction, agriculture, and energy across Rwanda.",
      heroImage: "/fleet/hero.png",
      aboutTitle: "Built to move Rwanda forward",
      aboutBody:
        "AXLE Inc. Ltd was established in 2017 in Rwanda by four shareholders who saw the need for dependable earthmoving machines. We buy brand-new equipment and rent it in sound mechanical condition—so your project stays competitive.",
      aboutImage: "/fleet/about.png",
      phone: "+250 788 000 000",
      email: "rentals@axle.rw",
      address: "Kigali, Rwanda",
      tagline: "Professionalism at its finest",
    },
    slides: [
      {
        id: "slide_1",
        image: "/fleet/excavator.png",
        title: "Excavators ready for your site",
        subtitle:
          "Precision digging for foundations, trenches, mining pits, and civil works.",
      },
      {
        id: "slide_2",
        image: "/fleet/bulldozer.png",
        title: "Bulldozers that clear the way",
        subtitle:
          "Raw pushing power for land clearing, leveling, and site preparation.",
      },
      {
        id: "slide_3",
        image: "/fleet/howo-truck.png",
        title: "Howo trucks for heavy haulage",
        subtitle:
          "Reliable tipper trucks for aggregate, spoil, and construction haulage.",
      },
    ],
    categories: [
      {
        id: "cat_earthmoving",
        slug: "earthmoving",
        name: "Earthmoving",
        description:
          "Excavators and bulldozers for digging, clearing, and site preparation.",
        coverImage: "/fleet/excavator.png",
        images: [
          "/fleet/excavator.png",
          "/fleet/bulldozer.png",
          "/fleet/about.png",
          "/fleet/hero.png",
        ],
        updatedAt: now,
      },
      {
        id: "cat_loading",
        slug: "loading",
        name: "Loading",
        description:
          "Wheel loaders for fast material handling on quarries and stockpiles.",
        coverImage: "/fleet/wheel-loader.png",
        images: ["/fleet/wheel-loader.png", "/fleet/about.png"],
        updatedAt: now,
      },
      {
        id: "cat_compaction",
        slug: "compaction",
        name: "Compaction",
        description:
          "Compactors for dense, stable ground on roads and foundations.",
        coverImage: "/fleet/compactor.png",
        images: ["/fleet/compactor.png", "/fleet/hero.png"],
        updatedAt: now,
      },
      {
        id: "cat_grading",
        slug: "grading",
        name: "Grading",
        description:
          "Motor graders for fine road finishing and drainage profiles.",
        coverImage: "/fleet/grader.png",
        images: ["/fleet/grader.png", "/fleet/about.png"],
        updatedAt: now,
      },
      {
        id: "cat_haulage",
        slug: "haulage",
        name: "Haulage",
        description:
          "Howo dump trucks for aggregate, spoil, and site haulage.",
        coverImage: "/fleet/howo-truck.png",
        images: ["/fleet/howo-truck.png", "/fleet/hero.png"],
        updatedAt: now,
      },
    ],
    branding: {
      companyName: "AXLE",
      legalName: "AXLE Inc. Ltd",
      tagline: "Professionalism at its finest",
      logo: "/brand/logo.png",
      favicon: "/favicon.png",
      logoHeight: 44,
      primaryColor: "#f5a623",
      accentColor: "#121417",
      regionLabel: "Rwanda · Earthmoving rental",
      supportEmail: "rentals@axle.rw",
      supportPhone: "+250 788 000 000",
      ctaLabel: "Rent equipment",
      navItems: [
        { id: "nav_home", label: "Home", href: "/", enabled: true },
        { id: "nav_fleet", label: "Fleet", href: "/fleet", enabled: true },
        {
          id: "nav_categories",
          label: "Categories",
          href: "/#categories",
          enabled: true,
        },
        { id: "nav_team", label: "Team", href: "/#team", enabled: true },
        { id: "nav_about", label: "About", href: "/about", enabled: true },
        { id: "nav_contact", label: "Contact", href: "/contact", enabled: true },
        { id: "nav_chat", label: "Support", href: "/chat", enabled: true },
      ],
      showTeam: true,
      showGallery: true,
      showChat: true,
      footerText:
        "Earthmoving machines for mining, construction, agriculture, and energy.",
      updatedAt: now,
    },
    chatThreads: [],
    chatMessages: [],
  };
}
