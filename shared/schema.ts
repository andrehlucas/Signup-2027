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

export const mail = pgTable("mail", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  receivedDate: text("received_date").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  envelopeImageUrl: text("envelope_image_url"),
  status: text("status").notNull().default("pending"),
  senderName: text("sender_name"),
  senderAddress: text("sender_address"),
  recipientName: text("recipient_name"),
  recipientAddress: text("recipient_address"),
});

export const mailSettings = pgTable("mail_settings", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  defaultAction: text("default_action").notNull().default("keep"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertLocationSchema = createInsertSchema(locations);
export const insertMailSchema = createInsertSchema(mail);
export const insertMailSettingsSchema = createInsertSchema(mailSettings);

export type UserType = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Mail = typeof mail.$inferSelect;
export type InsertMail = z.infer<typeof insertMailSchema>;
export type MailSettings = typeof mailSettings.$inferSelect;
export type InsertMailSettings = z.infer<typeof insertMailSettingsSchema>;

export type MailAction = 'scan' | 'forward' | 'keep' | 'shred' | 'not_my_mail';
