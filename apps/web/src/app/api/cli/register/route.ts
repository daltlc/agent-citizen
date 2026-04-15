import { NextResponse } from "next/server";
import { getCitizenByApiKey } from "@/lib/auth/api-key";
import { db } from "@/lib/db";
import { citizens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const key = authHeader?.replace("Bearer ", "");

  if (!key) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const citizen = await getCitizenByApiKey(key);
  if (!citizen) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  await db
    .update(citizens)
    .set({ cliInstalledAt: new Date() })
    .where(eq(citizens.id, citizen.id));

  return NextResponse.json({ success: true, username: citizen.username });
}
