import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  businessName: text("business_name").notNull().default("Opus Business"),
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  imageUrl: text("image_url"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertLocationSchema = createInsertSchema(locations);

export type UserType = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
