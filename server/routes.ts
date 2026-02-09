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

  app.get("/api/benefits", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const benefits = await storage.getBenefits(category);
      res.json(benefits);
    } catch (error) {
      console.error("Error fetching benefits:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/benefits/:id", async (req, res) => {
    try {
      const benefit = await storage.getBenefit(req.params.id);
      if (!benefit) {
        res.status(404).json({ message: "Benefit not found" });
        return;
      }
      res.json(benefit);
    } catch (error) {
      console.error("Error fetching benefit:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const FUNNEL_TRACKING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_FUNNEL_TRACKING === 'true';

  app.post("/api/funnel/events", async (req, res) => {
    if (!FUNNEL_TRACKING_ENABLED) {
      res.status(204).end();
      return;
    }
    try {
      const { sessionId, step, eventType, timestamp, duration, metadata, userAgent, referrer } = req.body;
      if (!sessionId || !step || !eventType || !timestamp) {
        res.status(400).json({ message: "sessionId, step, eventType, and timestamp are required" });
        return;
      }

      let session = await storage.getFunnelSession(sessionId);
      if (!session) {
        session = await storage.createFunnelSession({
          id: Math.random().toString(36).substr(2, 9),
          sessionId,
          startedAt: timestamp,
          lastSeenAt: timestamp,
          userAgent: userAgent || null,
          referrer: referrer || null,
          completed: false,
        });
      } else {
        await storage.updateFunnelSession(sessionId, { lastSeenAt: timestamp });
      }

      if (step === 'thank_you' && eventType === 'enter') {
        await storage.updateFunnelSession(sessionId, { completed: true, lastSeenAt: timestamp });
      }

      const event = await storage.createFunnelEvent({
        id: Math.random().toString(36).substr(2, 9),
        sessionId,
        step,
        eventType,
        timestamp,
        duration: duration || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
      res.status(201).json(event);
    } catch (error) {
      console.error("Error logging funnel event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/funnel/summary", async (_req, res) => {
    if (!FUNNEL_TRACKING_ENABLED) {
      res.json({ enabled: false, steps: [], sessions: { total: 0, completed: 0 }, events: [] });
      return;
    }
    try {
      const events = await storage.getFunnelEvents();
      const sessions = await storage.getFunnelSessions();

      const stepOrder: string[] = ['your_info', 'location', 'customize', 'checkout', 'thank_you'];
      const stepLabels: Record<string, string> = {
        your_info: 'Your Info',
        location: 'Location',
        customize: 'Customize',
        checkout: 'Checkout',
        thank_you: 'Thank You',
      };

      const stepStats = stepOrder.map(step => {
        const enterEvents = events.filter(e => e.step === step && e.eventType === 'enter');
        const completeEvents = events.filter(e => e.step === step && e.eventType === 'complete');
        const uniqueEnterSessions = new Set(enterEvents.map(e => e.sessionId)).size;
        const uniqueCompleteSessions = new Set(completeEvents.map(e => e.sessionId)).size;

        const durations = completeEvents
          .filter(e => e.duration !== null && e.duration !== undefined)
          .map(e => e.duration as number);
        const avgDuration = durations.length > 0
          ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
          : 0;

        return {
          step,
          label: stepLabels[step] || step,
          entered: uniqueEnterSessions,
          completed: uniqueCompleteSessions,
          avgDuration,
        };
      });

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.completed).length;

      const dailyData: Record<string, Record<string, Set<string>>> = {};
      events.forEach(e => {
        const day = e.timestamp.split('T')[0];
        if (!dailyData[day]) dailyData[day] = {};
        if (!dailyData[day][e.step]) dailyData[day][e.step] = new Set();
        if (e.eventType === 'enter') {
          dailyData[day][e.step].add(e.sessionId);
        }
      });

      const trends = Object.entries(dailyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, steps]) => {
          const row: Record<string, number | string> = { date };
          stepOrder.forEach(step => {
            row[step] = steps[step] ? steps[step].size : 0;
          });
          return row;
        });

      res.json({
        enabled: true,
        steps: stepStats,
        sessions: { total: totalSessions, completed: completedSessions },
        trends,
        recentEvents: events
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 50),
      });
    } catch (error) {
      console.error("Error fetching funnel summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
