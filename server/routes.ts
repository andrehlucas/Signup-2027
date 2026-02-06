import { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { MailAction, NotificationType } from "../shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/user", async (_req, res) => {
    try {
      // For now, return the first seeded user as "current user"
      const user = await storage.getUser("1");
      if (!user) {
        // Fallback user if not found
        res.json({ id: "1", username: "demo", businessName: "Acme Corporation" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/locations", async (_req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const location = await storage.getLocation(req.params.id);
      if (!location) {
        res.status(404).json({ message: "Location not found" });
        return;
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const { name, address, imageUrl } = req.body as { name: string; address: string; imageUrl?: string };
      
      if (!name || !address) {
        res.status(400).json({ message: "Name and address are required" });
        return;
      }

      const newLocation = await storage.createLocation({
        name,
        address,
        imageUrl: imageUrl || null,
      });
      res.status(201).json(newLocation);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/mail", async (_req, res) => {
    try {
      const pendingMail = await storage.getPendingMail();
      res.json(pendingMail);
    } catch (error) {
      console.error("Error fetching mail:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/mail/:id", async (req, res) => {
    try {
      const mail = await storage.getMail(req.params.id);
      if (!mail) {
        res.status(404).json({ message: "Mail not found" });
        return;
      }
      res.json(mail);
    } catch (error) {
      console.error("Error fetching mail:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/mail/:id/action", async (req, res) => {
    try {
      const { action } = req.body as { action: MailAction };
      const validActions: MailAction[] = ['scan', 'forward', 'keep', 'shred', 'not_my_mail'];
      
      if (!validActions.includes(action)) {
        res.status(400).json({ message: "Invalid action" });
        return;
      }

      const updatedMail = await storage.updateMailStatus(req.params.id, action);
      if (!updatedMail) {
        res.status(404).json({ message: "Mail not found" });
        return;
      }
      res.json(updatedMail);
    } catch (error) {
      console.error("Error updating mail:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/mail-settings", async (_req, res) => {
    try {
      const settings = await storage.getMailSettings("1");
      res.json(settings || { defaultAction: "keep" });
    } catch (error) {
      console.error("Error fetching mail settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/mail-settings", async (req, res) => {
    try {
      const { defaultAction } = req.body as { defaultAction: string };
      const validActions = ['scan', 'forward', 'keep', 'shred'];
      
      if (!validActions.includes(defaultAction)) {
        res.status(400).json({ message: "Invalid default action" });
        return;
      }

      const settings = await storage.updateMailSettings("1", defaultAction);
      res.json(settings);
    } catch (error) {
      console.error("Error updating mail settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      const type = req.query.type as NotificationType | undefined;
      const validTypes: NotificationType[] = ['mail', 'billing', 'account', 'service', 'location'];
      if (type && !validTypes.includes(type)) {
        res.status(400).json({ message: "Invalid notification type" });
        return;
      }
      const notifications = await storage.getNotifications("1", type);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/notifications/unread-count", async (_req, res) => {
    try {
      const count = await storage.getUnreadNotificationCount("1");
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const updated = await storage.markNotificationRead(req.params.id);
      if (!updated) {
        res.status(404).json({ message: "Notification not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error marking notification read:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/notifications/read-all", async (_req, res) => {
    try {
      await storage.markAllNotificationsRead("1");
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications read:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteNotification(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Notification not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/notification-preferences", async (_req, res) => {
    try {
      const prefs = await storage.getNotificationPreferences("1");
      res.json(prefs || {
        mailEnabled: true,
        billingEnabled: true,
        accountEnabled: true,
        serviceEnabled: true,
        locationEnabled: true,
        emailDelivery: true,
        inAppDelivery: true,
      });
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/notification-preferences", async (req, res) => {
    try {
      const updated = await storage.updateNotificationPreferences("1", req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
