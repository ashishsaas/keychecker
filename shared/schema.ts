import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateName: text("candidate_name").notNull(),
  rollNumber: text("roll_number").notNull(),
  examName: text("exam_name").notNull(),
  examDate: text("exam_date").notNull(),
  examTime: text("exam_time").notNull(),
  venueName: text("venue_name").notNull(),
  category: text("category").notNull(),
  subCategory: text("sub_category"),
  gender: text("gender").notNull(),
  state: text("state").notNull(),
  language: text("language").notNull(),
  answerKeyUrl: text("answer_key_url"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").references(() => candidates.id).notNull(),
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }).notNull(),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull(),
  totalAttempted: integer("total_attempted").notNull(),
  totalNotAttempted: integer("total_not_attempted").notNull(),
  totalCorrect: integer("total_correct").notNull(),
  totalWrong: integer("total_wrong").notNull(),
  percentile: decimal("percentile", { precision: 5, scale: 2 }),
  overallRank: integer("overall_rank"),
  shiftRank: integer("shift_rank"),
  categoryRank: integer("category_rank"),
  shiftAverage: decimal("shift_average", { precision: 5, scale: 2 }),
  categoryAverage: decimal("category_average", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const subjectScores = pgTable("subject_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resultId: varchar("result_id").references(() => examResults.id).notNull(),
  subjectName: text("subject_name").notNull(),
  attempted: integer("attempted").notNull(),
  notAttempted: integer("not_attempted").notNull(),
  correct: integer("correct").notNull(),
  wrong: integer("wrong").notNull(),
  totalMarks: decimal("total_marks", { precision: 5, scale: 2 }).notNull(),
  maxMarks: decimal("max_marks", { precision: 5, scale: 2 }).notNull(),
});

// Form submission schema
export const candidateFormSchema = z.object({
  answerKeyUrl: z.string()
    .refine(
      (val) =>
        val === "demo" ||
        val === "test" ||
        z.string().url().safeParse(val).success,
      "Please enter a valid URL or type 'demo' to test"
    ),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  state: z.string().min(1, "State is required"),
  language: z.string().min(1, "Language is required"),
});

// Schema for inserting into DB
export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
});


export const insertExamResultSchema = createInsertSchema(examResults).omit({
  id: true,
  createdAt: true,
});

export const insertSubjectScoreSchema = createInsertSchema(subjectScores).omit({
  id: true,
});

export type CandidateForm = z.infer<typeof candidateFormSchema>;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;
export type InsertSubjectScore = z.infer<typeof insertSubjectScoreSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type ExamResult = typeof examResults.$inferSelect;
export type SubjectScore = typeof subjectScores.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
