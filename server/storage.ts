import {
  metrics,
  updates,
  stakeholders,
  milestones,
  documents,
  asks,
  responses,
  users,
  type Metrics,
  type Update,
  type Stakeholder,
  type Milestone,
  type Document,
  type Ask,
  type Response,
  type User,
  type UpsertUser,
  type InsertMetrics,
  type InsertUpdate,
  type InsertStakeholder,
  type InsertMilestone,
  type InsertDocument,
  type InsertAsk,
  type InsertResponse,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Metrics
  getMetrics(): Promise<Metrics | undefined>;
  updateMetrics(metrics: Partial<InsertMetrics>): Promise<Metrics>;

  // Updates
  getUpdates(): Promise<Update[]>;
  createUpdate(update: InsertUpdate): Promise<Update>;
  updateUpdate(id: number, update: Partial<InsertUpdate>): Promise<Update | undefined>;
  deleteUpdate(id: number): Promise<boolean>;

  // Stakeholders
  getStakeholders(): Promise<Stakeholder[]>;
  createStakeholder(stakeholder: InsertStakeholder): Promise<Stakeholder>;
  updateStakeholder(id: number, stakeholder: Partial<InsertStakeholder>): Promise<Stakeholder | undefined>;

  // Milestones
  getMilestones(): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: number): Promise<boolean>;

  // Documents
  getDocuments(): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;

  // Asks
  getAsks(): Promise<Ask[]>;
  createAsk(ask: InsertAsk): Promise<Ask>;
  updateAsk(id: number, ask: Partial<InsertAsk>): Promise<Ask | undefined>;
  deleteAsk(id: number): Promise<boolean>;
  incrementAskViews(askId: number): Promise<void>;

  // Responses
  getResponsesByAskId(askId: number): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getMetrics(): Promise<Metrics | undefined> {
    const [metric] = await db.select().from(metrics);
    return metric || undefined;
  }

  async updateMetrics(newMetrics: Partial<InsertMetrics>): Promise<Metrics> {
    const [metric] = await db.select().from(metrics);
    
    if (metric) {
      const updateData = {
        ...newMetrics,
        updatedAt: new Date(),
      };
      const [updated] = await db
        .update(metrics)
        .set(updateData)
        .where(eq(metrics.id, metric.id))
        .returning();
      return updated;
    } else {
      // Create with defaults if no metrics exist
      const fullMetrics = {
        mrr: 0,
        runway: 0,
        burnRate: 0,
        activeUsers: 0,
        cac: 0,
        ltv: 0,
        churn: 0,
        teamSize: 0,
        openPositions: 0,
        cashBalance: 0,
        lastFundraise: "Pre-seed",
        ...newMetrics,
      };
      const [created] = await db
        .insert(metrics)
        .values(fullMetrics)
        .returning();
      return created;
    }
  }

  async getUpdates(): Promise<Update[]> {
    return await db.select().from(updates).orderBy(desc(updates.createdAt));
  }

  async createUpdate(insertUpdate: InsertUpdate): Promise<Update> {
    const [update] = await db
      .insert(updates)
      .values(insertUpdate)
      .returning();
    return update;
  }

  async updateUpdate(id: number, updateData: Partial<InsertUpdate>): Promise<Update | undefined> {
    const [updated] = await db
      .update(updates)
      .set(updateData)
      .where(eq(updates.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteUpdate(id: number): Promise<boolean> {
    const result = await db
      .delete(updates)
      .where(eq(updates.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getStakeholders(): Promise<Stakeholder[]> {
    return await db.select().from(stakeholders);
  }

  async createStakeholder(insertStakeholder: InsertStakeholder): Promise<Stakeholder> {
    const [stakeholder] = await db
      .insert(stakeholders)
      .values(insertStakeholder)
      .returning();
    return stakeholder;
  }

  async updateStakeholder(id: number, stakeholderData: Partial<InsertStakeholder>): Promise<Stakeholder | undefined> {
    const [updated] = await db
      .update(stakeholders)
      .set(stakeholderData)
      .where(eq(stakeholders.id, id))
      .returning();
    return updated || undefined;
  }

  async getMilestones(): Promise<Milestone[]> {
    return await db.select().from(milestones);
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const [milestone] = await db
      .insert(milestones)
      .values(insertMilestone)
      .returning();
    return milestone;
  }

  async updateMilestone(id: number, milestoneData: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const [updated] = await db
      .update(milestones)
      .set(milestoneData)
      .where(eq(milestones.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    const result = await db.delete(milestones).where(eq(milestones.id, id));
    return result.rowCount > 0;
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.date));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(documents)
      .where(eq(documents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAsks(): Promise<Ask[]> {
    return await db.select().from(asks).orderBy(desc(asks.createdAt));
  }

  async createAsk(insertAsk: InsertAsk): Promise<Ask> {
    const [ask] = await db
      .insert(asks)
      .values(insertAsk)
      .returning();
    return ask;
  }

  async updateAsk(id: number, askData: Partial<InsertAsk>): Promise<Ask | undefined> {
    const [updated] = await db
      .update(asks)
      .set(askData)
      .where(eq(asks.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAsk(id: number): Promise<boolean> {
    const result = await db
      .delete(asks)
      .where(eq(asks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementAskViews(askId: number): Promise<void> {
    try {
      await db.update(asks)
        .set({ views: sql`${asks.views} + 1` })
        .where(eq(asks.id, askId));
    } catch (error) {
      console.error("Error incrementing ask views:", error);
    }
  }

  async getResponsesByAskId(askId: number): Promise<Response[]> {
    return await db
      .select()
      .from(responses)
      .where(eq(responses.askId, askId))
      .orderBy(desc(responses.createdAt));
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const [response] = await db
      .insert(responses)
      .values(insertResponse)
      .returning();
    
    // Update ask response count
    const responseCountResult = await db
      .select()
      .from(responses)
      .where(eq(responses.askId, insertResponse.askId));
    
    await db
      .update(asks)
      .set({ responses: responseCountResult.length })
      .where(eq(asks.id, insertResponse.askId));

    return response;
  }
}

export class MemStorage implements IStorage {
  private metrics: Metrics | undefined;
  private updates: Map<number, Update>;
  private stakeholders: Map<number, Stakeholder>;
  private milestones: Map<number, Milestone>;
  private documents: Map<number, Document>;
  private asks: Map<number, Ask>;
  private responses: Map<number, Response>;
  private users: Map<string, User>;
  private currentId: number;

  constructor() {
    this.updates = new Map();
    this.stakeholders = new Map();
    this.milestones = new Map();
    this.documents = new Map();
    this.asks = new Map();
    this.responses = new Map();
    this.users = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      userType: userData.userType || "investor", // Default to investor if not specified
      createdAt: this.users.get(userData.id)?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  private initializeData() {
    // Initialize with some actual data
    this.metrics = {
      id: 1,
      mrr: 24500,
      runway: 18,
      burnRate: 28000,
      activeUsers: 2450,
      cac: 125,
      ltv: 1250,
      churn: 2.3,
      teamSize: 12,
      openPositions: 3,
      cashBalance: 504000,
      lastFundraise: "Pre-Seed",
      updatedAt: new Date(),
    };

    // Initialize stakeholders
    const initialStakeholders: Stakeholder[] = [
      {
        id: 1,
        name: "John Doe",
        title: "Founder & CEO",
        type: "Founder",
        shares: 6000000,
        percentage: 70.6,
        securityType: "Common Stock",
        initials: "JD",
      },
      {
        id: 2,
        name: "Jane Smith",
        title: "Co-Founder & CTO",
        type: "Founder",
        shares: 1500000,
        percentage: 17.6,
        securityType: "Common Stock",
        initials: "JS",
      },
      {
        id: 3,
        name: "Acme Ventures",
        title: "Lead Investor",
        type: "Investor",
        shares: 800000,
        percentage: 9.4,
        securityType: "SAFE",
        initials: "AC",
      },
      {
        id: 4,
        name: "Employee Pool",
        title: "Reserved Options",
        type: "Options",
        shares: 1200000,
        percentage: 14.1,
        securityType: "Stock Options",
        initials: "EP",
      },
    ];

    initialStakeholders.forEach((s) => this.stakeholders.set(s.id, s));

    // Initialize milestones
    const initialMilestones: Milestone[] = [
      {
        id: 1,
        title: "Pre-Seed Round Completed",
        description: "Successfully raised $500K pre-seed round led by Acme Ventures. Funds will be used for product development and team expansion.",
        date: "March 2024",
        status: "Completed",
        amount: 500000,
        investors: 3,
        icon: "fas fa-rocket",
      },
      {
        id: 2,
        title: "Series A Preparation",
        description: "Preparing for Series A round with target of $3M to accelerate growth and expand into new markets.",
        date: "Q4 2024 (Planned)",
        status: "In Progress",
        amount: 3000000,
        investors: null,
        icon: "fas fa-chart-line",
      },
      {
        id: 3,
        title: "Company Formation",
        description: "Incorporated Cynco Inc. in Delaware and established initial equity structure.",
        date: "January 2024",
        status: "Completed",
        amount: null,
        investors: null,
        icon: "fas fa-building",
      },
    ];

    initialMilestones.forEach((m) => this.milestones.set(m.id, m));

    this.currentId = 5;
  }

  async getMetrics(): Promise<Metrics | undefined> {
    return this.metrics;
  }

  async updateMetrics(newMetrics: Partial<InsertMetrics>): Promise<Metrics> {
    const currentMetrics = this.metrics || {
      id: 1,
      mrr: 0,
      runway: 0,
      burnRate: 0,
      activeUsers: 0,
      cac: 0,
      ltv: 0,
      churn: 0,
      teamSize: 0,
      openPositions: 0,
      cashBalance: 0,
      lastFundraise: "Pre-seed",
      updatedAt: new Date(),
    };
    
    this.metrics = {
      ...currentMetrics,
      ...newMetrics,
      updatedAt: new Date(),
    };
    return this.metrics;
  }

  async getUpdates(): Promise<Update[]> {
    return Array.from(this.updates.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createUpdate(insertUpdate: InsertUpdate): Promise<Update> {
    const id = this.currentId++;
    const update: Update = {
      ...insertUpdate,
      id,
      attachments: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
    };
    this.updates.set(id, update);
    return update;
  }

  async updateUpdate(id: number, updateData: Partial<InsertUpdate>): Promise<Update | undefined> {
    const existing = this.updates.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData };
    this.updates.set(id, updated);
    return updated;
  }

  async deleteUpdate(id: number): Promise<boolean> {
    return this.updates.delete(id);
  }

  async getStakeholders(): Promise<Stakeholder[]> {
    return Array.from(this.stakeholders.values());
  }

  async createStakeholder(insertStakeholder: InsertStakeholder): Promise<Stakeholder> {
    const id = this.currentId++;
    const stakeholder: Stakeholder = { ...insertStakeholder, id };
    this.stakeholders.set(id, stakeholder);
    return stakeholder;
  }

  async updateStakeholder(id: number, stakeholderData: Partial<InsertStakeholder>): Promise<Stakeholder | undefined> {
    const existing = this.stakeholders.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...stakeholderData };
    this.stakeholders.set(id, updated);
    return updated;
  }

  async getMilestones(): Promise<Milestone[]> {
    return Array.from(this.milestones.values());
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const id = this.currentId++;
    const milestone: Milestone = { 
      ...insertMilestone, 
      id,
      amount: insertMilestone.amount ?? null,
      investors: insertMilestone.investors ?? null
    };
    this.milestones.set(id, milestone);
    return milestone;
  }

  async updateMilestone(id: number, milestoneData: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const existing = this.milestones.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...milestoneData };
    this.milestones.set(id, updated);
    return updated;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    return this.milestones.delete(id);
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const document: Document = {
      ...insertDocument,
      id,
      date: new Date(),
      description: insertDocument.description || null,
    };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  async getAsks(): Promise<Ask[]> {
    return Array.from(this.asks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createAsk(insertAsk: InsertAsk): Promise<Ask> {
    const id = this.currentId++;
    const ask: Ask = {
      ...insertAsk,
      id,
      responses: 0,
      views: 0,
      createdAt: new Date(),
    };
    this.asks.set(id, ask);
    return ask;
  }

  async updateAsk(id: number, askData: Partial<InsertAsk>): Promise<Ask | undefined> {
    const existing = this.asks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...askData };
    this.asks.set(id, updated);
    return updated;
  }

  async deleteAsk(id: number): Promise<boolean> {
    return this.asks.delete(id);
  }

  async incrementAskViews(askId: number): Promise<void> {
    const ask = this.asks.get(askId);
    if (ask) {
      ask.views = (ask.views || 0) + 1;
      this.asks.set(askId, ask);
    }
  }

  async getResponsesByAskId(askId: number): Promise<Response[]> {
    return Array.from(this.responses.values())
      .filter(r => r.askId === askId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = this.currentId++;
    const response: Response = {
      ...insertResponse,
      id,
      createdAt: new Date(),
    };
    this.responses.set(id, response);

    // Update ask response count
    const ask = this.asks.get(insertResponse.askId);
    if (ask) {
      ask.responses += 1;
      this.asks.set(ask.id, ask);
    }

    return response;
  }
}

export const storage = new MemStorage();
