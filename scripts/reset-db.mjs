import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

try {
  await fs.unlink(dbPath);
  console.log("Removed data/db.json. Fresh seed will load on next app start.");
} catch (err) {
  if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
    console.log("No database file yet. Seed will create one on next app start.");
  } else {
    throw err;
  }
}
