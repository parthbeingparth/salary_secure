import { promises as fs } from "fs";
import path from "path";
import type { WaitlistRecord } from "@/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "waitlist.json");

async function ensureStore(): Promise<WaitlistRecord[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(FILE_PATH, "utf8");
    return JSON.parse(raw) as WaitlistRecord[];
  } catch {
    return [];
  }
}

export async function localInsert(
  record: WaitlistRecord,
): Promise<WaitlistRecord> {
  const rows = await ensureStore();
  rows.push(record);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");
  return record;
}
