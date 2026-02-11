import { pgTable, text, varchar, boolean, integer } from "drizzle-orm/pg-core";
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

export type NotificationType = 'mail' | 'billing' | 'account' | 'service' | 'location';

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  link: text("link"),
  createdAt: text("created_at").notNull(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  mailEnabled: boolean("mail_enabled").notNull().default(true),
  billingEnabled: boolean("billing_enabled").notNull().default(true),
  accountEnabled: boolean("account_enabled").notNull().default(true),
  serviceEnabled: boolean("service_enabled").notNull().default(true),
  locationEnabled: boolean("location_enabled").notNull().default(true),
  emailDelivery: boolean("email_delivery").notNull().default(true),
  inAppDelivery: boolean("in_app_delivery").notNull().default(true),
});

export const insertNotificationSchema = createInsertSchema(notifications);
export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;

export const funnelSessions = pgTable("funnel_sessions", {
  id: varchar("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  startedAt: text("started_at").notNull(),
  lastSeenAt: text("last_seen_at").notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  completed: boolean("completed").notNull().default(false),
});

export const funnelEvents = pgTable("funnel_events", {
  id: varchar("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  step: text("step").notNull(),
  eventType: text("event_type").notNull(),
  timestamp: text("timestamp").notNull(),
  duration: integer("duration"),
  metadata: text("metadata"),
});

export const insertFunnelSessionSchema = createInsertSchema(funnelSessions);
export const insertFunnelEventSchema = createInsertSchema(funnelEvents);

export type FunnelSession = typeof funnelSessions.$inferSelect;
export type InsertFunnelSession = z.infer<typeof insertFunnelSessionSchema>;
export type FunnelEvent = typeof funnelEvents.$inferSelect;
export type InsertFunnelEvent = z.infer<typeof insertFunnelEventSchema>;

export type FunnelStep = 'your_info' | 'pick_plan' | 'customize' | 'checkout';
export type FunnelEventType = 'enter' | 'complete';
