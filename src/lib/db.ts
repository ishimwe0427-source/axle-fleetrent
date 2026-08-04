import { promises as fs } from "fs";
import path from "path";
import { createSeedDatabase } from "./seed";
import type {
  Branding,
  ChatMessage,
  ChatThread,
  Database,
  FleetItem,
  GalleryCategory,
  HeroSlide,
  RentalRequest,
  SiteContent,
  User,
} from "./types";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "fleetrent-data")
  : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

async function ensureDb(): Promise<Database> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<Database>;
    const seed = await createSeedDatabase();
    const needsMigrate =
      !parsed.slides ||
      !parsed.categories ||
      !parsed.branding ||
      !parsed.chatThreads ||
      !parsed.chatMessages;

    if (needsMigrate) {
      // Keep real users if present, but drop known demo accounts.
      const users = (parsed.users || seed.users).filter(
        (u) =>
          !["admin@axle.rw", "client@axle.rw"].includes(u.email.toLowerCase()),
      );
      const hasSuper = users.some((u) => u.role === "superadmin");
      const branding = {
        ...seed.branding,
        ...(parsed.branding || {}),
        logoHeight: parsed.branding?.logoHeight ?? seed.branding.logoHeight,
        ctaLabel: parsed.branding?.ctaLabel ?? seed.branding.ctaLabel,
        navItems: parsed.branding?.navItems?.length
          ? parsed.branding.navItems
          : seed.branding.navItems,
      };
      const merged: Database = {
        users: hasSuper ? users : [...seed.users, ...users],
        fleet: parsed.fleet || seed.fleet,
        rentals: parsed.rentals || [],
        content: parsed.content || seed.content,
        slides: parsed.slides || seed.slides,
        categories: parsed.categories || seed.categories,
        branding,
        chatThreads: parsed.chatThreads || [],
        chatMessages: parsed.chatMessages || [],
      };
      await writeDb(merged);
      return merged;
    }
    const db = parsed as Database;
    // Soft-fill new branding fields on older DBs without full rewrite.
    if (db.branding && (db.branding.logoHeight == null || !db.branding.ctaLabel)) {
      db.branding = {
        ...seed.branding,
        ...db.branding,
        logoHeight: db.branding.logoHeight ?? seed.branding.logoHeight,
        ctaLabel: db.branding.ctaLabel ?? seed.branding.ctaLabel,
      };
      await writeDb(db);
    }
    return db;
  } catch {
    const seed = await createSeedDatabase();
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

async function writeDb(db: Database) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function getDb(): Promise<Database> {
  return ensureDb();
}

export async function getBranding(): Promise<Branding> {
  const db = await ensureDb();
  return db.branding;
}

export async function updateBranding(
  patch: Partial<Branding>,
): Promise<Branding> {
  const db = await ensureDb();
  db.branding = {
    ...db.branding,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return db.branding;
}

export async function getContent(): Promise<SiteContent> {
  const db = await ensureDb();
  return db.content;
}

export async function updateContent(
  patch: Partial<SiteContent>,
): Promise<SiteContent> {
  const db = await ensureDb();
  db.content = { ...db.content, ...patch };
  await writeDb(db);
  return db.content;
}

export async function getSlides(): Promise<HeroSlide[]> {
  const db = await ensureDb();
  return db.slides;
}

export async function saveSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
  const db = await ensureDb();
  db.slides = slides;
  await writeDb(db);
  return db.slides;
}

export async function getCategories(): Promise<GalleryCategory[]> {
  const db = await ensureDb();
  return db.categories;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<GalleryCategory | null> {
  const db = await ensureDb();
  return db.categories.find((c) => c.slug === slug) ?? null;
}

export async function upsertCategory(
  category: GalleryCategory,
): Promise<GalleryCategory> {
  const db = await ensureDb();
  const index = db.categories.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    db.categories[index] = category;
  } else {
    db.categories.push(category);
  }
  await writeDb(db);
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await ensureDb();
  const before = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  await writeDb(db);
  return db.categories.length < before;
}

export async function getFleet(): Promise<FleetItem[]> {
  const db = await ensureDb();
  return db.fleet;
}

export async function getFleetBySlug(slug: string): Promise<FleetItem | null> {
  const db = await ensureDb();
  return db.fleet.find((item) => item.slug === slug) ?? null;
}

export async function getFleetById(id: string): Promise<FleetItem | null> {
  const db = await ensureDb();
  return db.fleet.find((item) => item.id === id) ?? null;
}

export async function getFleetByCategoryName(
  categoryName: string,
): Promise<FleetItem[]> {
  const db = await ensureDb();
  return db.fleet.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase(),
  );
}

export async function upsertFleet(item: FleetItem): Promise<FleetItem> {
  const db = await ensureDb();
  const index = db.fleet.findIndex((f) => f.id === item.id);
  if (index >= 0) {
    db.fleet[index] = item;
  } else {
    db.fleet.push(item);
  }
  await writeDb(db);
  return item;
}

export async function deleteFleet(id: string): Promise<boolean> {
  const db = await ensureDb();
  const before = db.fleet.length;
  db.fleet = db.fleet.filter((f) => f.id !== id);
  await writeDb(db);
  return db.fleet.length < before;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await ensureDb();
  return (
    db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await ensureDb();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function listUsers(): Promise<User[]> {
  const db = await ensureDb();
  return db.users;
}

export async function createUser(
  user: Omit<User, "id" | "createdAt">,
): Promise<User> {
  const db = await ensureDb();
  const existing = db.users.find(
    (u) => u.email.toLowerCase() === user.email.toLowerCase(),
  );
  if (existing) {
    throw new Error("Email already registered");
  }
  const created: User = {
    ...user,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(created);
  await writeDb(db);
  return created;
}

export async function updateUserRole(
  id: string,
  role: User["role"],
): Promise<User | null> {
  const db = await ensureDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;
  if (user.role === "superadmin" && role !== "superadmin") {
    const supers = db.users.filter((u) => u.role === "superadmin");
    if (supers.length <= 1) {
      throw new Error("Cannot demote the only super admin");
    }
  }
  user.role = role;
  await writeDb(db);
  return user;
}

export async function getRentals(): Promise<RentalRequest[]> {
  const db = await ensureDb();
  return db.rentals.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function getRentalsByUser(userId: string): Promise<RentalRequest[]> {
  const rentals = await getRentals();
  return rentals.filter((r) => r.userId === userId);
}

export async function updateRentalStatus(
  id: string,
  status: RentalRequest["status"],
): Promise<RentalRequest | null> {
  const db = await ensureDb();
  const rental = db.rentals.find((r) => r.id === id);
  if (!rental) return null;
  rental.status = status;
  syncFleetAvailability(db, rental.fleetId);
  await writeDb(db);
  return rental;
}

function syncFleetAvailability(db: Database, fleetId: string) {
  const machine = db.fleet.find((f) => f.id === fleetId);
  if (!machine) return;
  const busy = db.rentals.some(
    (r) =>
      r.fleetId === fleetId &&
      (r.status === "approved" || r.status === "active"),
  );
  machine.available = !busy;
  machine.updatedAt = new Date().toISOString();
}

export async function createRental(
  rental: Omit<RentalRequest, "id" | "createdAt" | "status">,
): Promise<RentalRequest> {
  const db = await ensureDb();
  const machine = db.fleet.find((f) => f.id === rental.fleetId);
  if (!machine) {
    throw new Error("Machine not found");
  }
  if (!machine.available) {
    throw new Error(
      "This machine is currently booked on site and is not available.",
    );
  }
  const created: RentalRequest = {
    ...rental,
    id: `rent_${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.rentals.push(created);
  await writeDb(db);
  return created;
}

export async function getChatThreads(): Promise<ChatThread[]> {
  const db = await ensureDb();
  return db.chatThreads.sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
  );
}

export async function getChatThreadsByUser(
  userId: string,
): Promise<ChatThread[]> {
  const threads = await getChatThreads();
  return threads.filter((t) => t.userId === userId);
}

export async function getChatThread(
  id: string,
): Promise<ChatThread | null> {
  const db = await ensureDb();
  return db.chatThreads.find((t) => t.id === id) ?? null;
}

export async function createChatThread(input: {
  userId: string;
  subject: string;
  firstMessage: string;
  senderName: string;
  senderRole: User["role"];
}): Promise<{ thread: ChatThread; message: ChatMessage }> {
  const db = await ensureDb();
  const nowIso = new Date().toISOString();
  const thread: ChatThread = {
    id: `thread_${Date.now()}`,
    userId: input.userId,
    subject: input.subject,
    status: "open",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  const message: ChatMessage = {
    id: `msg_${Date.now()}`,
    threadId: thread.id,
    senderId: input.userId,
    senderName: input.senderName,
    senderRole: input.senderRole,
    body: input.firstMessage,
    createdAt: nowIso,
  };
  db.chatThreads.push(thread);
  db.chatMessages.push(message);
  await writeDb(db);
  return { thread, message };
}

export async function addChatMessage(input: {
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: User["role"];
  body: string;
}): Promise<ChatMessage> {
  const db = await ensureDb();
  const thread = db.chatThreads.find((t) => t.id === input.threadId);
  if (!thread) throw new Error("Conversation not found");
  if (thread.status === "closed") {
    throw new Error("This conversation is closed");
  }
  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    threadId: input.threadId,
    senderId: input.senderId,
    senderName: input.senderName,
    senderRole: input.senderRole,
    body: input.body,
    createdAt: new Date().toISOString(),
  };
  db.chatMessages.push(message);
  thread.updatedAt = message.createdAt;
  await writeDb(db);
  return message;
}

export async function getChatMessages(
  threadId: string,
): Promise<ChatMessage[]> {
  const db = await ensureDb();
  return db.chatMessages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
}

export async function setChatThreadStatus(
  id: string,
  status: ChatThread["status"],
): Promise<ChatThread | null> {
  const db = await ensureDb();
  const thread = db.chatThreads.find((t) => t.id === id);
  if (!thread) return null;
  thread.status = status;
  thread.updatedAt = new Date().toISOString();
  await writeDb(db);
  return thread;
}

export function formatRwf(amount: number): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(amount);
}
