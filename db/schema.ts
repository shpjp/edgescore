import { pgTable, text, timestamp, uuid, integer, real } from "drizzle-orm/pg-core";

// --- Users ---
// Minimal user record. Auth provider details live in Auth.js tables (added later).
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  roleTarget: text("role_target"), // e.g. "SWE", "PM", "Data Scientist"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  googleId: text("google_id").unique()
});

// --- Sessions ---
// One session = one recorded interview attempt for a specific question.
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "behavioral" | "dsa" | "system_design"
  question: text("question").notNull(),
  transcript: text("transcript"),  // populated after Whisper transcription
  audioUrl: text("audio_url"),     // S3/blob URL of the recorded audio
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Scores ---
// One-to-one with a session. Created after LLM evaluation completes.
export const scores = pgTable("scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .unique() // one score per session
    .references(() => sessions.id, { onDelete: "cascade" }),
  clarityScore: integer("clarity_score"),     // 0–100
  structureScore: integer("structure_score"), // 0–100
  technicalScore: integer("technical_score"), // 0–100
  fillerDensity: real("filler_density"),       // filler words per 100 words
  compositeScore: integer("composite_score"), // weighted aggregate, 0–100
});

// Inferred TypeScript types for inserts — useful in server actions
export type NewUser = typeof users.$inferInsert;
export type NewSession = typeof sessions.$inferInsert;
export type NewScore = typeof scores.$inferInsert;
