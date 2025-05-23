// lib/dbCheck.ts
import { prisma } from "./client";

let connected = false;

export async function connectDatabase(): Promise<boolean> {
  if (!connected) {
    try {
      await prisma.$connect();
      connected = true;
      console.log("✅ Connected to database");
    } catch (err) {
      console.error("❌ DB connection failed", err);
      return false;
    }
  }

  try {
    await prisma.$queryRaw`SELECT 1`; // Lightweight query
    return true;
  } catch (err) {
    console.error("❌ DB health check failed", err);
    return false;
  }
}
