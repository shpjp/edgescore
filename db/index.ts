import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// neon() creates an HTTP-based SQL executor — works in Edge & Node runtimes
const sql = neon(process.env.DATABASE_URL!);

// drizzle wraps the executor and binds the schema for type-safe queries
export const db = drizzle(sql, { schema });
