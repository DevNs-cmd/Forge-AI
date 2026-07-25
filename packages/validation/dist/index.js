"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAnalysisRequestSchema = exports.workspaceTaskSchema = exports.workspaceDocumentSchema = exports.applicationSchema = exports.projectSchema = exports.startupSchema = exports.acquisitionListingSchema = exports.syndicateSchema = exports.serviceProviderSchema = exports.investorProfileSchema = exports.builderProfileSchema = exports.validationEvidenceSchema = exports.validationExperimentSchema = exports.founderCandidateSchema = exports.ideaSchema = exports.mentorProfileSchema = exports.userProfileSchema = exports.authLoginSchema = exports.authRegisterSchema = exports.userRoleSchema = void 0;
const zod_1 = require("zod");
// --- User Roles ---
exports.userRoleSchema = zod_1.z.enum(["founder", "builder", "investor", "mentor", "admin"]);
// --- Auth Schemas ---
exports.authRegisterSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters").max(30),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    fullName: zod_1.z.string().min(2, "Full name required"),
    role: exports.userRoleSchema.default("founder")
});
exports.authLoginSchema = zod_1.z.object({
    loginIdentifier: zod_1.z.string().min(1, "Email or Username is required"),
    password: zod_1.z.string().min(1, "Password is required")
});
// --- Core Identity & Profile Schemas ---
exports.userProfileSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    userId: zod_1.z.string(),
    username: zod_1.z.string().optional(),
    fullName: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email().optional(),
    avatarUrl: zod_1.z.string().optional().or(zod_1.z.literal("")),
    headline: zod_1.z.string().max(160).optional(),
    bio: zod_1.z.string().max(1000).optional(),
    role: exports.userRoleSchema.optional(),
    onboardingComplete: zod_1.z.boolean().default(false),
    profileCompleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
exports.mentorProfileSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    userId: zod_1.z.string(),
    expertiseAreas: zod_1.z.array(zod_1.z.string()).default([]),
    yearsExperience: zod_1.z.number().default(5),
    companyHistory: zod_1.z.array(zod_1.z.string()).default([]),
    hourlyRate: zod_1.z.number().default(0),
    proBonoAvailable: zod_1.z.boolean().default(true),
    totalSessionsConducted: zod_1.z.number().default(0),
    rating: zod_1.z.number().min(0).max(5).default(5.0),
    createdAt: zod_1.z.string().optional()
});
// --- Idea OS & Exchange Schemas ---
exports.ideaSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    ownerId: zod_1.z.string(),
    ownerName: zod_1.z.string().optional(),
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    oneLiner: zod_1.z.string().min(10, "One-liner must be at least 10 characters").max(280),
    problemStatement: zod_1.z.string().min(10, "Please describe the problem in more detail"),
    solution: zod_1.z.string().min(10, "Please describe your proposed solution"),
    targetMarket: zod_1.z.string().optional(),
    icp: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "refining", "validated", "archived"]).default("draft"),
    readinessScore: zod_1.z.number().min(0).max(100).default(0),
    upvotes: zod_1.z.number().optional().default(0),
    competitors: zod_1.z.array(zod_1.z.string()).optional().default([]),
    tags: zod_1.z.array(zod_1.z.string()).optional().default([]),
    userVoted: zod_1.z.boolean().optional().default(false),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
// --- Founder Matching Engine Schemas ---
exports.founderCandidateSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    avatarUrl: zod_1.z.string(),
    roleTitle: zod_1.z.string(),
    skills: zod_1.z.array(zod_1.z.string()),
    commitment: zod_1.z.enum(["Full-time", "Part-time", "Advisory"]),
    workingStyle: zod_1.z.string(),
    riskTolerance: zod_1.z.enum(["High", "Medium", "Low"]),
    matchScore: zod_1.z.number().min(0).max(100),
    bio: zod_1.z.string(),
    location: zod_1.z.string()
});
// --- Validation OS Schemas ---
exports.validationExperimentSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    ideaId: zod_1.z.string(),
    title: zod_1.z.string().min(5, "Experiment title must be at least 5 characters"),
    hypothesis: zod_1.z.string().min(10, "Please state your hypothesis clearly"),
    metricToTrack: zod_1.z.string().min(3, "Define the success metric to track"),
    targetValue: zod_1.z.string().min(1, "Define target value for success"),
    currentValue: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "running", "completed", "cancelled"]).default("pending"),
    result: zod_1.z.enum(["inconclusive", "validated", "invalidated"]).optional().default("inconclusive"),
    notes: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
exports.validationEvidenceSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    experimentId: zod_1.z.string(),
    type: zod_1.z.enum(["interview", "landing_page", "survey", "pre_sale", "other"]),
    sourceName: zod_1.z.string().min(2, "Define the source of the evidence"),
    description: zod_1.z.string().min(5, "Describe what this evidence shows"),
    strength: zod_1.z.enum(["low", "medium", "high"]).default("medium"),
    rawLink: zod_1.z.string().optional().or(zod_1.z.literal("")),
    createdAt: zod_1.z.string().optional()
});
// --- Builder Marketplace Schemas ---
exports.builderProfileSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    title: zod_1.z.string(),
    avatarUrl: zod_1.z.string(),
    primarySkills: zod_1.z.array(zod_1.z.string()),
    hourlyRate: zod_1.z.string(),
    equityPreference: zod_1.z.string(),
    rating: zod_1.z.number(),
    completedMissions: zod_1.z.number(),
    bio: zod_1.z.string(),
    githubUrl: zod_1.z.string().optional()
});
// --- Capital Marketplace Schemas ---
exports.investorProfileSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    firm: zod_1.z.string(),
    type: zod_1.z.enum(["Angel", "VC", "Syndicate", "Family Office"]),
    checkSizeRange: zod_1.z.string(),
    preferredStages: zod_1.z.array(zod_1.z.string()),
    theses: zod_1.z.array(zod_1.z.string()),
    portfolioCount: zod_1.z.number(),
    avatarUrl: zod_1.z.string(),
    location: zod_1.z.string()
});
// --- Services Marketplace Schemas ---
exports.serviceProviderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    category: zod_1.z.enum(["Legal & Incorporation", "Accounting & Tax", "AWS/Cloud Credits", "Marketing & PR", "Design"]),
    offerDetails: zod_1.z.string(),
    perksValue: zod_1.z.string(),
    verifiedBadge: zod_1.z.boolean(),
    logoUrl: zod_1.z.string()
});
// --- Startup Syndicates Schemas ---
exports.syndicateSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    leadName: zod_1.z.string(),
    targetAllocation: zod_1.z.string(),
    committedAmount: zod_1.z.string(),
    membersCount: zod_1.z.number(),
    focusSector: zod_1.z.string(),
    status: zod_1.z.enum(["Open", "Closing Soon", "Filled"])
});
// --- Acquisition Marketplace Schemas ---
exports.acquisitionListingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    category: zod_1.z.string(),
    arr: zod_1.z.string(),
    askingPrice: zod_1.z.string(),
    profitMargin: zod_1.z.string(),
    techStack: zod_1.z.array(zod_1.z.string()),
    status: zod_1.z.enum(["Listed", "Under Diligence", "Acquired"])
});
// --- Startup & Workspace Schemas ---
exports.startupSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(2, "Company name must be at least 2 characters"),
    logoUrl: zod_1.z.string().optional().or(zod_1.z.literal("")),
    industry: zod_1.z.string().min(2, "Industry must be specified"),
    description: zod_1.z.string().min(10, "Company description must be defined"),
    stage: zod_1.z.enum(["ideation", "validation", "formation", "operation", "growth", "exit"]).default("formation"),
    mrr: zod_1.z.number().optional().default(0),
    valuation: zod_1.z.number().optional().default(0),
    teamSize: zod_1.z.number().optional().default(1),
    createdBy: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
exports.projectSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    startupId: zod_1.z.string(),
    title: zod_1.z.string().min(3),
    description: zod_1.z.string(),
    requiredSkills: zod_1.z.array(zod_1.z.string()).default([]),
    budgetRange: zod_1.z.string().optional(),
    equityOffered: zod_1.z.string().optional(),
    status: zod_1.z.enum(["open", "in_progress", "completed", "cancelled"]).default("open"),
    createdAt: zod_1.z.string().optional()
});
exports.applicationSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    projectId: zod_1.z.string(),
    applicantId: zod_1.z.string(),
    coverLetter: zod_1.z.string(),
    proposedRate: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "reviewed", "accepted", "rejected"]).default("pending"),
    createdAt: zod_1.z.string().optional()
});
exports.workspaceDocumentSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    startupId: zod_1.z.string(),
    title: zod_1.z.string().min(1, "Document title is required"),
    content: zod_1.z.string().default(""),
    category: zod_1.z.enum(["general", "strategy", "finance", "legal", "product", "marketing"]).default("general"),
    authorId: zod_1.z.string(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
exports.workspaceTaskSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    startupId: zod_1.z.string(),
    title: zod_1.z.string().min(3, "Task title must be at least 3 characters"),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["todo", "in_progress", "done", "backlog"]).default("todo"),
    priority: zod_1.z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    assigneeId: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
// --- LangGraph AI Schemas ---
exports.aiAnalysisRequestSchema = zod_1.z.object({
    title: zod_1.z.string(),
    oneLiner: zod_1.z.string(),
    problemStatement: zod_1.z.string(),
    solution: zod_1.z.string(),
    mode: zod_1.z.enum([
        "validation",
        "refinement",
        "market_research",
        "competitor_analysis",
        "pitch_improvement",
        "investor_readiness",
        "roadmap"
    ]).default("validation")
});
