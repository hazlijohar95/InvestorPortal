import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUpdateSchema, insertStakeholderSchema, insertMilestoneSchema, insertAskSchema, insertDocumentSchema, insertResponseSchema, insertMetricsSchema } from "@shared/schema";
import { setupAuth, isAuthenticated, requireAdmin } from "./simpleAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Metrics routes
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.put("/api/metrics", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMetricsSchema.partial().parse(req.body);
      const metrics = await storage.updateMetrics(validatedData);
      res.json(metrics);
    } catch (error) {
      res.status(400).json({ message: "Invalid metrics data" });
    }
  });

  // Updates routes
  app.get("/api/updates", async (req, res) => {
    try {
      const updates = await storage.getUpdates();
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch updates" });
    }
  });

  app.post("/api/updates", async (req, res) => {
    try {
      const validatedData = insertUpdateSchema.parse(req.body);
      const update = await storage.createUpdate(validatedData);
      res.status(201).json(update);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.put("/api/updates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUpdateSchema.partial().parse(req.body);
      const update = await storage.updateUpdate(id, validatedData);
      if (!update) {
        return res.status(404).json({ message: "Update not found" });
      }
      res.json(update);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/updates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteUpdate(id);
      if (!deleted) {
        return res.status(404).json({ message: "Update not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete update" });
    }
  });

  // Stakeholders routes
  app.get("/api/stakeholders", async (req, res) => {
    try {
      const stakeholders = await storage.getStakeholders();
      res.json(stakeholders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stakeholders" });
    }
  });

  app.post("/api/stakeholders", async (req, res) => {
    try {
      const validatedData = insertStakeholderSchema.parse(req.body);
      const stakeholder = await storage.createStakeholder(validatedData);
      res.status(201).json(stakeholder);
    } catch (error) {
      res.status(400).json({ message: "Invalid stakeholder data" });
    }
  });

  app.put("/api/stakeholders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertStakeholderSchema.partial().parse(req.body);
      const stakeholder = await storage.updateStakeholder(id, validatedData);
      if (!stakeholder) {
        return res.status(404).json({ message: "Stakeholder not found" });
      }
      res.json(stakeholder);
    } catch (error) {
      res.status(400).json({ message: "Invalid stakeholder data" });
    }
  });

  // Milestones routes
  app.get("/api/milestones", async (req, res) => {
    try {
      const milestones = await storage.getMilestones();
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  app.post("/api/milestones", async (req, res) => {
    try {
      const validatedData = insertMilestoneSchema.parse(req.body);
      const milestone = await storage.createMilestone(validatedData);
      res.status(201).json(milestone);
    } catch (error) {
      res.status(400).json({ message: "Invalid milestone data" });
    }
  });

  app.put("/api/milestones/:id", isAuthenticated, async (req, res) => {
    console.log("=== MILESTONE UPDATE DEBUG ===");
    console.log("ID:", req.params.id);
    console.log("Body:", req.body);
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMilestoneSchema.partial().parse(req.body);
      console.log("Validated data:", validatedData);
      
      const milestone = await storage.updateMilestone(id, validatedData);
      console.log("Updated milestone:", milestone);
      
      if (!milestone) {
        console.log("Milestone not found");
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      console.log("Sending response:", milestone);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(milestone);
    } catch (error) {
      console.error("Milestone update error:", error);
      return res.status(400).json({ message: "Invalid milestone data" });
    }
  });

  // Delete milestone route
  app.delete("/api/milestones/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMilestone(id);
      if (!deleted) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Milestone delete error:", error);
      res.status(500).json({ message: "Failed to delete milestone" });
    }
  });

  // Documents routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDocument(id);
      if (!deleted) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Asks routes
  app.get("/api/asks", async (req, res) => {
    try {
      const asks = await storage.getAsks();
      res.json(asks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asks" });
    }
  });

  app.post("/api/asks", async (req, res) => {
    try {
      const validatedData = insertAskSchema.parse(req.body);
      const ask = await storage.createAsk(validatedData);
      res.status(201).json(ask);
    } catch (error) {
      res.status(400).json({ message: "Invalid ask data" });
    }
  });

  app.put("/api/asks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAskSchema.partial().parse(req.body);
      const ask = await storage.updateAsk(id, validatedData);
      if (!ask) {
        return res.status(404).json({ message: "Ask not found" });
      }
      res.json(ask);
    } catch (error) {
      res.status(400).json({ message: "Invalid ask data" });
    }
  });

  app.delete("/api/asks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAsk(id);
      if (!deleted) {
        return res.status(404).json({ message: "Ask not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ask" });
    }
  });

  // Responses routes
  app.get("/api/asks/:askId/responses", async (req, res) => {
    try {
      const askId = parseInt(req.params.askId);
      const responses = await storage.getResponsesByAskId(askId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch responses" });
    }
  });

  app.post("/api/asks/:askId/responses", async (req, res) => {
    try {
      const askId = parseInt(req.params.askId);
      const responseData = { ...req.body, askId };
      const validatedData = insertResponseSchema.parse(responseData);
      const response = await storage.createResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: "Invalid response data" });
    }
  });

  app.post("/api/asks/:askId/view", async (req, res) => {
    try {
      const askId = parseInt(req.params.askId);
      // Increment view count
      await storage.incrementAskViews(askId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Failed to track view" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
