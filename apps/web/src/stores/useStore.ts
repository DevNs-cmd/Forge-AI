import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { 
  Idea, 
  ValidationExperiment, 
  ValidationEvidence, 
  Startup, 
  WorkspaceDocument, 
  WorkspaceTask,
  UserProfile,
  FounderCandidate,
  BuilderProfile,
  InvestorProfile,
  ServiceProvider,
  Syndicate,
  AcquisitionListing
} from "@project-forge/validation";
import { supabase } from "@/lib/supabaseClient";


export type CoreModuleType = 
  | "dashboard"
  | "idea-exchange"
  | "founder-matching"
  | "startup-creation"
  | "validation-os"
  | "builder-marketplace"
  | "capital-marketplace"
  | "data-intelligence"
  | "services-marketplace"
  | "founder-os"
  | "syndicates"
  | "acquisition-marketplace";

interface RegisteredUser {
  username: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: "user" | "builder" | "investor" | "admin";
}

interface ForgeStore {
  // Authentication & Session
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  registeredUsers: RegisteredUser[];
  showAuthModal: boolean;
  authModalMode: "login" | "register";
  
  // Navigation & Space Context
  activeRole: "user" | "builder" | "investor";
  activeContext: "personal" | "company";
  activeModule: CoreModuleType;
  
  // Datasets for all 10 Core Modules
  ideas: Idea[];
  upvotedIdeaIds: string[];
  experiments: ValidationExperiment[];
  evidence: ValidationEvidence[];
  founderCandidates: FounderCandidate[];
  builderProfiles: BuilderProfile[];
  investorProfiles: InvestorProfile[];
  serviceProviders: ServiceProvider[];
  syndicates: Syndicate[];
  acquisitions: AcquisitionListing[];
  startups: Startup[];
  documents: WorkspaceDocument[];
  tasks: WorkspaceTask[];
  
  // Active Selection Handles
  activeIdeaId: string | null;
  activeStartupId: string | null;
  
  // Actions
  setShowAuthModal: (show: boolean, mode?: "login" | "register") => void;
  registerUser: (newUser: RegisteredUser) => { success: boolean; message: string };
  loginUser: (identifier: string, pass: string) => { success: boolean; message: string };
  logoutUser: () => void;
  
  setActiveRole: (role: "user" | "builder" | "investor") => void;
  setActiveContext: (context: "personal" | "company") => void;
  setActiveModule: (module: CoreModuleType) => void;
  
  fetchIdeas: () => Promise<void>;
  addIdea: (idea: Idea) => void;
  upvoteIdea: (ideaId: string) => void;
  updateIdea: (ideaId: string, updates: Partial<Idea>) => void;
  setActiveIdeaId: (id: string | null) => void;
  
  addExperiment: (exp: ValidationExperiment) => void;
  updateExperiment: (expId: string, updates: Partial<ValidationExperiment>) => void;
  addEvidence: (ev: ValidationEvidence) => void;
  
  addStartup: (startup: Startup) => void;
  setActiveStartupId: (id: string | null) => void;
  
  addDocument: (doc: WorkspaceDocument) => void;
  updateDocument: (docId: string, updates: Partial<WorkspaceDocument>) => void;
  addTask: (task: WorkspaceTask) => void;
  updateTask: (taskId: string, updates: Partial<WorkspaceTask>) => void;
}

export const useForgeStore = create<ForgeStore>()(
  persist(
    (set, get) => ({
      // Default Session State
      currentUser: {
        id: "usr-demo",
        userId: "user-123",
        username: "demo_founder",
        fullName: "Alex Rivera",
        email: "alex@forge.os",
        role: "user",
        headline: "Serial Entrepreneur & AI Architect"
      },
      isLoggedIn: true,
      registeredUsers: [
        {
          username: "demo_founder",
          email: "alex@forge.os",
          fullName: "Alex Rivera",
          passwordHash: "password123",
          role: "user"
        }
      ],
      showAuthModal: false,
      authModalMode: "login",
      
      activeRole: "user",
      activeContext: "personal",
      activeModule: "dashboard",
      upvotedIdeaIds: [],
      
      // Default Seed Data for 10 Modules
      ideas: [
        {
          id: "idea-1",
          ownerId: "user-123",
          ownerName: "Alex Rivera",
          title: "DirectFarm Logistics",
          oneLiner: "Automated logistics connection directly between micro-farms and local restaurants.",
          problemStatement: "Small farms lose up to 30% of margins using standard commercial aggregators and face severe shipping delays.",
          solution: "A localized real-time delivery dispatcher app that group-schedules weekly driver routes from farms to urban hubs.",
          status: "refining",
          readinessScore: 45,
          upvotes: 28,
          competitors: ["DoorDash Drive", "LocalBounty", "Farm2Table Direct"],
          icp: "Organic farmers and restaurant kitchen managers.",
          targetMarket: "$850M addressable local logistics market."
        },
        {
          id: "idea-2",
          ownerId: "usr-456",
          ownerName: "Sarah Chen",
          title: "CodeAudit AI",
          oneLiner: "Autonomous AI security compliance auditing for Next.js and FastAPI codebases.",
          problemStatement: "Startups spend weeks preparing SOC2 and ISO compliance documentation before Enterprise deals.",
          solution: "Continuous background agent that auto-scans pull requests and generates live compliance data rooms.",
          status: "validated",
          readinessScore: 85,
          upvotes: 64,
          competitors: ["Vanta", "Drata", "Snyk"],
          icp: "Seed-stage CTOs selling to Enterprise customers.",
          targetMarket: "$4.2B Global Compliance Automation Market."
        }
      ],

      founderCandidates: [
        {
          id: "cand-1",
          name: "Marcus Vance",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          roleTitle: "Technical Co-founder / Backend Lead",
          skills: ["NestJS", "PostgreSQL", "LangGraph", "Docker"],
          commitment: "Full-time",
          workingStyle: "Asynchronous & Fast Prototyping",
          riskTolerance: "High",
          matchScore: 94,
          bio: "Ex-Stripe Senior Engineer. Built high-scale financial microservices handling $10M+ daily volume.",
          location: "San Francisco, CA (Remote)"
        },
        {
          id: "cand-2",
          name: "Elena Rostova",
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
          roleTitle: "Growth & Product Co-founder",
          skills: ["Product Strategy", "B2B SaaS Growth", "Investor Outreach"],
          commitment: "Full-time",
          workingStyle: "Metrics-Driven & Agile Sprints",
          riskTolerance: "High",
          matchScore: 89,
          bio: "Scaled a B2B SaaS startup from 0 to $1.5M ARR in 18 months. Passionate about AI startup ecosystems.",
          location: "New York, NY"
        }
      ],

      builderProfiles: [
        {
          id: "build-1",
          name: "David Kim",
          title: "Full-Stack Next.js & UI Architect",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          primarySkills: ["Next.js 15", "Tailwind CSS", "Zustand", "Framer Motion"],
          hourlyRate: "$65/hr",
          equityPreference: "Equity + Cash Split",
          rating: 4.9,
          completedMissions: 18,
          bio: "Frontend specialist focused on ultra-premium SaaS UI and responsive dashboard engines."
        },
        {
          id: "build-2",
          name: "Aisha Patel",
          title: "AI Engineer & LangGraph Specialist",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          primarySkills: ["Python", "FastAPI", "LangGraph", "Qdrant", "Redis"],
          hourlyRate: "$80/hr",
          equityPreference: "Equity Only / Co-founder Track",
          rating: 5.0,
          completedMissions: 12,
          bio: "Builds production-grade multi-agent autonomous workflows and vector retrieval systems."
        }
      ],

      investorProfiles: [
        {
          id: "inv-1",
          name: "Vanguard Seed Fund",
          firm: "Vanguard Ventures",
          type: "VC",
          checkSizeRange: "$250k - $1.5M",
          preferredStages: ["Ideation", "Validation", "Formation"],
          theses: ["B2B SaaS", "AI Agents", "Logistics & Supply Chain"],
          portfolioCount: 42,
          avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
          location: "Silicon Valley, CA"
        },
        {
          id: "inv-2",
          name: "Sophia Zhang",
          firm: "Angel Syndicate Lead",
          type: "Angel",
          checkSizeRange: "$25k - $100k",
          preferredStages: ["Validation", "MVP"],
          theses: ["Developer Tools", "AI Infrastructure", "Fintech"],
          portfolioCount: 19,
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          location: "Boston, MA"
        }
      ],

      serviceProviders: [
        {
          id: "srv-1",
          name: "Clerky Legal Incorporation",
          category: "Legal & Incorporation",
          offerDetails: "Form Delaware C-Corp with founder stock issuance and IP assignment agreements.",
          perksValue: "$200 Discount + Free Registered Agent",
          verifiedBadge: true,
          logoUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=150"
        },
        {
          id: "srv-2",
          name: "AWS Activate for Startups",
          category: "AWS/Cloud Credits",
          offerDetails: "Cloud infrastructure credits, technical support, and architectural reviews.",
          perksValue: "$10,000 Free Credits",
          verifiedBadge: true,
          logoUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150"
        }
      ],

      syndicates: [
        {
          id: "syn-1",
          name: "AI Founders Syndicate I",
          leadName: "Sophia Zhang",
          targetAllocation: "$500,000",
          committedAmount: "$380,000",
          membersCount: 34,
          focusSector: "Autonomous AI Agents",
          status: "Open"
        }
      ],

      acquisitions: [
        {
          id: "acq-1",
          title: "SaaS Metrics Bot (Micro-SaaS)",
          category: "B2B SaaS",
          arr: "$120,000",
          askingPrice: "$450,000",
          profitMargin: "82%",
          techStack: ["Next.js", "Stripe", "PostgreSQL"],
          status: "Listed"
        }
      ],

      experiments: [
        {
          id: "exp-1",
          ideaId: "idea-1",
          title: "Customer Discovery Interviews",
          hypothesis: "At least 7 out of 10 kitchen managers will list shipping commissions as a top-3 operational pain point.",
          metricToTrack: "Percentage ranking margin loss in top-3 issues",
          targetValue: "70%",
          currentValue: "80%",
          status: "completed",
          result: "validated",
          notes: "Completed 10 interviews. Highly positive validation signals."
        }
      ],

      evidence: [
        {
          id: "ev-1",
          experimentId: "exp-1",
          type: "interview",
          sourceName: "Chef Mark, Green Bistro",
          description: "Mark confirmed he would pay up to 10% commission for local direct delivery instead of 25% to major aggregators.",
          strength: "high"
        }
      ],

      startups: [],
      documents: [
        {
          id: "doc-1",
          startupId: "startup-placeholder",
          title: "Forge Operating Blueprint",
          content: "# Forge Operating Blueprint\n\n1. Phase 1: MVP Validation Flow.\n2. Phase 2: Builder Talent Sourcing.\n3. Phase 3: Investor Capital Pipeline.",
          category: "strategy",
          authorId: "user-123"
        }
      ],

      tasks: [
        {
          id: "task-1",
          startupId: "startup-placeholder",
          title: "Set up waitlist landing page",
          description: "Create landing page template routes for waitlist tests.",
          status: "todo",
          priority: "high"
        }
      ],

      activeIdeaId: "idea-1",
      activeStartupId: null,

      // Authentication Actions
      setShowAuthModal: (show, mode = "login") => set({ showAuthModal: show, authModalMode: mode }),
      
      registerUser: (newUser) => {
        const state = get();
        const existing = state.registeredUsers.find(
          u => u.username.toLowerCase() === newUser.username.toLowerCase() || u.email.toLowerCase() === newUser.email.toLowerCase()
        );

        if (existing) {
          return { success: false, message: `Username or Email '${newUser.username}' is already registered!` };
        }

        const registeredUsers = [...state.registeredUsers, newUser];
        const userProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          userId: `user-${Date.now()}`,
          username: newUser.username,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          headline: `Forge ${newUser.role} member`
        };

        set({
          registeredUsers,
          currentUser: userProfile,
          isLoggedIn: true,
          showAuthModal: false
        });

        return { success: true, message: "Registration successful! Welcome to Forge OS." };
      },

      loginUser: (identifier, pass) => {
        const state = get();
        const userMatch = state.registeredUsers.find(
          u => (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase())
        );

        if (!userMatch) {
          return { success: false, message: "User not found. Please register a new account first." };
        }

        if (userMatch.passwordHash !== pass) {
          return { success: false, message: "Incorrect password. Please try again." };
        }

        const userProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          userId: `user-${Date.now()}`,
          username: userMatch.username,
          fullName: userMatch.fullName,
          email: userMatch.email,
          role: userMatch.role,
          headline: `Forge ${userMatch.role} member`
        };

        set({
          currentUser: userProfile,
          isLoggedIn: true,
          showAuthModal: false
        });

        return { success: true, message: `Welcome back, ${userMatch.fullName}!` };
      },

      logoutUser: () => set({ currentUser: null, isLoggedIn: false }),

      // Navigation Actions
      setActiveRole: (role) => set({ activeRole: role }),
      setActiveContext: (context) => set({ activeContext: context }),
      setActiveModule: (module) => set({ activeModule: module }),

      fetchIdeas: async () => {
        try {
          const { data, error } = await supabase
            .from("ideas")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Error fetching ideas from Supabase:", error);
            return;
          }

          if (data && data.length > 0) {
            const mappedIdeas = data.map((item: any) => ({
              id: item.id,
              ownerId: item.owner_id,
              ownerName: item.owner_name,
              title: item.title,
              oneLiner: item.one_liner,
              problemStatement: item.problem_statement,
              solution: item.solution,
              status: item.status,
              readinessScore: item.readiness_score,
              upvotes: item.upvotes,
              competitors: item.competitors || [],
              icp: item.icp,
              targetMarket: item.target_market
            }));
            set({ ideas: mappedIdeas });
          }
        } catch (err) {
          console.error("Failed to connect or fetch from Supabase:", err);
        }
      },

      // Entity Actions
      addIdea: async (idea) => {
        // Optimistic UI updates
        set((state) => ({ 
          ideas: [idea, ...state.ideas], 
          activeIdeaId: idea.id || null 
        }));

        try {
          const { error } = await supabase.from("ideas").insert([{
            id: idea.id,
            owner_id: idea.ownerId,
            owner_name: idea.ownerName,
            title: idea.title,
            one_liner: idea.oneLiner,
            problem_statement: idea.problemStatement,
            solution: idea.solution,
            status: idea.status,
            readiness_score: idea.readinessScore,
            upvotes: idea.upvotes,
            competitors: idea.competitors,
            icp: idea.icp,
            target_market: idea.targetMarket
          }]);
          if (error) {
            console.error("Error inserting idea in Supabase:", error);
          }
        } catch (err) {
          console.error("Failed to insert idea in Supabase:", err);
        }
      },
      
      upvoteIdea: async (ideaId) => {
        const state = get();
        if (state.upvotedIdeaIds?.includes(ideaId)) {
          alert("You have already upvoted this startup concept!");
          return;
        }

        const currentIdea = state.ideas.find(i => i.id === ideaId);
        const newUpvotes = (currentIdea?.upvotes || 0) + 1;

        // Optimistic UI updates
        set((state) => ({
          upvotedIdeaIds: [...(state.upvotedIdeaIds || []), ideaId],
          ideas: state.ideas.map(i => i.id === ideaId ? { ...i, upvotes: newUpvotes } : i)
        }));

        try {
          const { error } = await supabase
            .from("ideas")
            .update({ upvotes: newUpvotes })
            .eq("id", ideaId);
          if (error) {
            console.error("Error upvoting idea in Supabase:", error);
          }
        } catch (err) {
          console.error("Failed to upvote idea in Supabase:", err);
        }
      },
      
      updateIdea: (ideaId, updates) => set((state) => ({
        ideas: state.ideas.map((id) => id.id === ideaId ? { ...id, ...updates } : id)
      })),
      
      setActiveIdeaId: (id) => set({ activeIdeaId: id }),

      addExperiment: (exp) => set((state) => ({ experiments: [...state.experiments, exp] })),
      updateExperiment: (expId, updates) => set((state) => ({
        experiments: state.experiments.map((ex) => ex.id === expId ? { ...ex, ...updates } : ex)
      })),

      addEvidence: (ev) => set((state) => ({ evidence: [...state.evidence, ev] })),

      addStartup: (startup) => set((state) => ({ 
        startups: [startup, ...state.startups], 
        activeStartupId: startup.id || null 
      })),
      
      setActiveStartupId: (id) => set({ activeStartupId: id }),

      addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
      updateDocument: (docId, updates) => set((state) => ({
        documents: state.documents.map((d) => d.id === docId ? { ...d, ...updates } : d)
      })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
      }))
    }),
    {
      name: "forge-os-persistent-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
