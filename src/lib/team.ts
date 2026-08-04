export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  image: string;
  shortBio: string;
  bio: string;
  focus: string[];
  email?: string;
  socials: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
};

export const teamMembers: TeamMember[] = [
  {
    slug: "marvin-mugisha",
    name: "Marvin Mugisha",
    role: "CEO",
    image: "/team/marvin-mugisha.jpg",
    shortBio:
      "Leads AXLE’s vision for dependable earthmoving rental across Rwanda.",
    bio: "Marvin Mugisha is Chief Executive Officer of AXLE Inc. Ltd. He helps drive the company’s mission to put brand-new, well-maintained excavators, loaders, bulldozers, compactors, graders, and Howo trucks on mining, construction, agriculture, and energy sites across Rwanda. Under his leadership, AXLE focuses on competitive pricing, sound mechanical condition, and service that keeps client projects moving.",
    focus: [
      "Company strategy & growth",
      "Client partnerships",
      "Fleet investment decisions",
    ],
    socials: {
      linkedin: "https://rw.linkedin.com/in/marvin-tom-mugisha-8a6896170",
    },
  },
  {
    slug: "david-ishimwe",
    name: "David Ishimwe",
    role: "Finance Manager",
    image: "/team/david-ishimwe.jpg",
    shortBio:
      "Keeps AXLE’s rental operations financially clear, fair, and sustainable.",
    bio: "David Ishimwe is Finance Manager at AXLE Inc. Ltd. He oversees pricing structure, rental contracts, and financial planning so clients get competitive rates while the company continues investing in brand-new earthmoving machines. David works closely with operations to keep billing transparent and hire windows commercially sound.",
    focus: [
      "Rental pricing & contracts",
      "Financial planning",
      "Client billing clarity",
    ],
    socials: {
      linkedin: "https://rw.linkedin.com/in/ishimwe-david-b49a23137",
    },
  },
  {
    slug: "mugabi-gerald",
    name: "Mugabi Gerald",
    role: "Operations Manager",
    image: "/team/mugabi-gerald.jpg",
    shortBio:
      "Runs day-to-day mobilization so machines arrive site-ready and on time.",
    bio: "Mugabi Gerald is Operations Manager at AXLE Inc. Ltd. He coordinates machine readiness, mobilization, operators when needed, and on-site support. Gerald’s focus is practical delivery: making sure excavators, loaders, bulldozers, compactors, graders, and Howo trucks leave the yard in sound condition and reach client sites on schedule.",
    focus: [
      "Fleet readiness & dispatch",
      "Site mobilization",
      "Technical support coordination",
    ],
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((member) => member.slug === slug);
}
