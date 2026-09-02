export type UserRole = "superadmin" | "admin" | "customer";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  company?: string;
  createdAt: string;
};

export type FleetItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  available: boolean;
  specs: { label: string; value: string }[];
  featured: boolean;
  updatedAt: string;
};

export type RentalStatus =
  | "pending"
  | "approved"
  | "active"
  | "completed"
  | "rejected";

export type EmailDelivery = "sent" | "failed" | "skipped";

export type RentalRequest = {
  id: string;
  userId: string;
  fleetId: string;
  startDate: string;
  endDate: string;
  location: string;
  notes: string;
  status: RentalStatus;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  emailStatus?: EmailDelivery;
};

export type HeroSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

export type GalleryCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  updatedAt: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
};

export type Branding = {
  companyName: string;
  legalName: string;
  tagline: string;
  logo: string;
  favicon: string;
  logoHeight: number;
  primaryColor: string;
  accentColor: string;
  regionLabel: string;
  supportEmail: string;
  supportPhone: string;
  ctaLabel: string;
  navItems: NavItem[];
  showTeam: boolean;
  showGallery: boolean;
  showChat: boolean;
  sitePublished: boolean;
  footerText: string;
  updatedAt: string;
};

export type MailSettings = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
};

export type EmailLog = {
  id: string;
  to: string;
  subject: string;
  kind: "booking_received" | "booking_status" | "contact" | "test";
  status: EmailDelivery;
  error?: string;
  rentalId?: string;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  phone: string;
  email: string;
  address: string;
  tagline: string;
};

export type ChatThreadStatus = "open" | "closed";

export type ChatThread = {
  id: string;
  userId: string;
  subject: string;
  status: ChatThreadStatus;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  body: string;
  createdAt: string;
};

export type Database = {
  users: User[];
  fleet: FleetItem[];
  rentals: RentalRequest[];
  content: SiteContent;
  slides: HeroSlide[];
  categories: GalleryCategory[];
  branding: Branding;
  chatThreads: ChatThread[];
  chatMessages: ChatMessage[];
  mailSettings: MailSettings;
  emailLogs: EmailLog[];
  contactMessages: ContactMessage[];
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export function isStaff(role: UserRole): boolean {
  return role === "admin" || role === "superadmin";
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === "superadmin";
}

export function isSiteLive(branding: Branding): boolean {
  const env = process.env.SITE_PUBLISHED;
  if (env === "true") return true;
  if (env === "false") return false;
  return branding.sitePublished;
}
