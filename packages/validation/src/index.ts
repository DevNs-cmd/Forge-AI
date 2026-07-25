import { z } from "zod";

// --- User Roles ---
export const userRoleSchema = z.enum(["founder", "builder", "investor", "mentor", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

// --- Auth Schemas ---
export const authRegisterSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name required"),
  role: userRoleSchema.default("founder")
});

export type AuthRegister = z.infer<typeof authRegisterSchema>;

export const authLoginSchema = z.object({
  loginIdentifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required")
});

export type AuthLogin = z.infer<typeof authLoginSchema>;

// --- Core Identity & Profile Schemas ---
export const userProfileSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  username: z.string().optional(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional(),
  avatarUrl: z.string().optional().or(z.literal("")),
  headline: z.string().max(160).optional(),
  bio: z.string().max(1000).optional(),
  role: userRoleSchema.optional(),
  onboardingComplete: z.boolean().default(false),
  profileCompleted: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const mentorProfileSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  expertiseAreas: z.array(z.string()).default([]),
  yearsExperience: z.number().default(5),
  companyHistory: z.array(z.string()).default([]),
  hourlyRate: z.number().default(0),
  proBonoAvailable: z.boolean().default(true),
  totalSessionsConducted: z.number().default(0),
  rating: z.number().min(0).max(5).default(5.0),
  createdAt: z.string().optional()
});

export type MentorProfile = z.infer<typeof mentorProfileSchema>;

// --- Idea OS & Exchange Schemas ---
export const ideaSchema = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  ownerName: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  oneLiner: z.string().min(10, "One-liner must be at least 10 characters").max(280),
  problemStatement: z.string().min(10, "Please describe the problem in more detail"),
  solution: z.string().min(10, "Please describe your proposed solution"),
  targetMarket: z.string().optional(),
  icp: z.string().optional(),
  status: z.enum(["draft", "refining", "validated", "archived"]).default("draft"),
  readinessScore: z.number().min(0).max(100).default(0),
  upvotes: z.number().optional().default(0),
  competitors: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  userVoted: z.boolean().optional().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type Idea = z.infer<typeof ideaSchema>;

// --- Founder Matching Engine Schemas ---
export const founderCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string(),
  roleTitle: z.string(),
  skills: z.array(z.string()),
  commitment: z.enum(["Full-time", "Part-time", "Advisory"]),
  workingStyle: z.string(),
  riskTolerance: z.enum(["High", "Medium", "Low"]),
  matchScore: z.number().min(0).max(100),
  bio: z.string(),
  location: z.string()
});

export type FounderCandidate = z.infer<typeof founderCandidateSchema>;

// --- Validation OS Schemas ---
export const validationExperimentSchema = z.object({
  id: z.string().optional(),
  ideaId: z.string(),
  title: z.string().min(5, "Experiment title must be at least 5 characters"),
  hypothesis: z.string().min(10, "Please state your hypothesis clearly"),
  metricToTrack: z.string().min(3, "Define the success metric to track"),
  targetValue: z.string().min(1, "Define target value for success"),
  currentValue: z.string().optional(),
  status: z.enum(["pending", "running", "completed", "cancelled"]).default("pending"),
  result: z.enum(["inconclusive", "validated", "invalidated"]).optional().default("inconclusive"),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type ValidationExperiment = z.infer<typeof validationExperimentSchema>;

export const validationEvidenceSchema = z.object({
  id: z.string().optional(),
  experimentId: z.string(),
  type: z.enum(["interview", "landing_page", "survey", "pre_sale", "other"]),
  sourceName: z.string().min(2, "Define the source of the evidence"),
  description: z.string().min(5, "Describe what this evidence shows"),
  strength: z.enum(["low", "medium", "high"]).default("medium"),
  rawLink: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional()
});

export type ValidationEvidence = z.infer<typeof validationEvidenceSchema>;

// --- Builder Marketplace Schemas ---
export const builderProfileSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string(),
  title: z.string(),
  avatarUrl: z.string(),
  primarySkills: z.array(z.string()),
  hourlyRate: z.string(),
  equityPreference: z.string(),
  rating: z.number(),
  completedMissions: z.number(),
  bio: z.string(),
  githubUrl: z.string().optional()
});

export type BuilderProfile = z.infer<typeof builderProfileSchema>;

// --- Capital Marketplace Schemas ---
export const investorProfileSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string(),
  firm: z.string(),
  type: z.enum(["Angel", "VC", "Syndicate", "Family Office"]),
  checkSizeRange: z.string(),
  preferredStages: z.array(z.string()),
  theses: z.array(z.string()),
  portfolioCount: z.number(),
  avatarUrl: z.string(),
  location: z.string()
});

export type InvestorProfile = z.infer<typeof investorProfileSchema>;

// --- Services Marketplace Schemas ---
export const serviceProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["Legal & Incorporation", "Accounting & Tax", "AWS/Cloud Credits", "Marketing & PR", "Design"]),
  offerDetails: z.string(),
  perksValue: z.string(),
  verifiedBadge: z.boolean(),
  logoUrl: z.string()
});

export type ServiceProvider = z.infer<typeof serviceProviderSchema>;

// --- Startup Syndicates Schemas ---
export const syndicateSchema = z.object({
  id: z.string(),
  name: z.string(),
  leadName: z.string(),
  targetAllocation: z.string(),
  committedAmount: z.string(),
  membersCount: z.number(),
  focusSector: z.string(),
  status: z.enum(["Open", "Closing Soon", "Filled"])
});

export type Syndicate = z.infer<typeof syndicateSchema>;

// --- Acquisition Marketplace Schemas ---
export const acquisitionListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  arr: z.string(),
  askingPrice: z.string(),
  profitMargin: z.string(),
  techStack: z.array(z.string()),
  status: z.enum(["Listed", "Under Diligence", "Acquired"])
});

export type AcquisitionListing = z.infer<typeof acquisitionListingSchema>;

// --- Startup & Workspace Schemas ---
export const startupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Company name must be at least 2 characters"),
  logoUrl: z.string().optional().or(z.literal("")),
  industry: z.string().min(2, "Industry must be specified"),
  description: z.string().min(10, "Company description must be defined"),
  stage: z.enum(["ideation", "validation", "formation", "operation", "growth", "exit"]).default("formation"),
  mrr: z.number().optional().default(0),
  valuation: z.number().optional().default(0),
  teamSize: z.number().optional().default(1),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type Startup = z.infer<typeof startupSchema>;

export const projectSchema = z.object({
  id: z.string().optional(),
  startupId: z.string(),
  title: z.string().min(3),
  description: z.string(),
  requiredSkills: z.array(z.string()).default([]),
  budgetRange: z.string().optional(),
  equityOffered: z.string().optional(),
  status: z.enum(["open", "in_progress", "completed", "cancelled"]).default("open"),
  createdAt: z.string().optional()
});

export type Project = z.infer<typeof projectSchema>;

export const applicationSchema = z.object({
  id: z.string().optional(),
  projectId: z.string(),
  applicantId: z.string(),
  coverLetter: z.string(),
  proposedRate: z.string().optional(),
  status: z.enum(["pending", "reviewed", "accepted", "rejected"]).default("pending"),
  createdAt: z.string().optional()
});

export type Application = z.infer<typeof applicationSchema>;

export const workspaceDocumentSchema = z.object({
  id: z.string().optional(),
  startupId: z.string(),
  title: z.string().min(1, "Document title is required"),
  content: z.string().default(""),
  category: z.enum(["general", "strategy", "finance", "legal", "product", "marketing"]).default("general"),
  authorId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type WorkspaceDocument = z.infer<typeof workspaceDocumentSchema>;

export const workspaceTaskSchema = z.object({
  id: z.string().optional(),
  startupId: z.string(),
  title: z.string().min(3, "Task title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done", "backlog"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type WorkspaceTask = z.infer<typeof workspaceTaskSchema>;

// --- LangGraph AI Schemas ---
export const aiAnalysisRequestSchema = z.object({
  title: z.string(),
  oneLiner: z.string(),
  problemStatement: z.string(),
  solution: z.string(),
  mode: z.enum([
    "validation",
    "refinement",
    "market_research",
    "competitor_analysis",
    "pitch_improvement",
    "investor_readiness",
    "roadmap"
  ]).default("validation")
});

export type AIAnalysisRequest = z.infer<typeof aiAnalysisRequestSchema>;

