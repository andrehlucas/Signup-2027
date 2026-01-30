import { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  app.get("/api/locations", async (_req, res) => {
    const locations = await storage.getLocations();
    res.json(locations);
  });

  app.get("/api/locations/:id", async (req, res) => {
    const location = await storage.getLocation(req.params.id);
    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }
    res.json(location);
  });

  const httpServer = createServer(app);
  return httpServer;
}
