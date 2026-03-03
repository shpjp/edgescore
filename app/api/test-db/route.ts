import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/test-db
// Inserts a dummy user and reads it back. Delete this route before shipping.
export async function GET() {
  const email = `test-${Date.now()}@edgescore.dev`;

  // Insert
  const [inserted] = await db
    .insert(users)
    .values({ email, roleTarget: "SWE" })
    .returning();

  // Select back by id to confirm round-trip
  const [fetched] = await db
    .select()
    .from(users)
    .where(eq(users.id, inserted.id));

  return Response.json({ inserted, fetched });
}
