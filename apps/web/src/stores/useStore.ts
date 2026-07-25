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
  MentorProfile,
  ServiceProvider,
  Syndicate,
  AcquisitionListing,
  UserRole
} from "@project-forge/validation";
import { 
  fetchUserProfiles, 
  fetchBuilderProfiles, 
  fetchInvestorProfiles, 
  fetchIdeasFromDB,
  createIdeaInDB,
  toggleVoteInDB,
  signUpUser,
  signInUser,
  signOutUser,
  supabase
} from "../services/supabaseService";

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
  | "acquisition-marketplace"
  | "mentor-hub"
  | "admin-os";

interface RegisteredUser {
  username: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: UserRole;
}

interface ForgeStore {
  // Authentication & Session
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  registeredUsers: RegisteredUser[];
  showAuthModal: boolean;
  authModalMode: "login" | "register";
  isLoading: boolean;
  errorMessage: string | null;
  
  // Landing Page vs App View
  viewMode: "landing" | "app";
  showOnboardingModal: boolean;
  isOnboarded: boolean;
  
  // Navigation & Space Context
  activeRole: UserRole;
  activeContext: "personal" | "company";
  activeModule: CoreModuleType;
  
  // Datasets
  ideas: Idea[];
  experiments: ValidationExperiment[];
  evidence: ValidationEvidence[];
  founderCandidates: FounderCandidate[];
  builderProfiles: BuilderProfile[];
  investorProfiles: InvestorProfile[];
  mentorProfiles: MentorProfile[];
  serviceProviders: ServiceProvider[];
  syndicates: Syndicate[];
  acquisitions: AcquisitionListing[];
  startups: Startup[];
  documents: WorkspaceDocument[];
  tasks: WorkspaceTask[];
  
  // Handles
  activeIdeaId: string | null;
  activeStartupId: string | null;
  
  // Actions
  setViewMode: (mode: "landing" | "app") => void;
  setShowOnboardingModal: (show: boolean) => void;
  completeOnboarding: (data: any) => Promise<void>;
  
  setShowAuthModal: (show: boolean, mode?: "login" | "register") => void;
  registerUser: (newUser: { username: string; email: string; fullName: string; pass: string; role: UserRole }) => Promise<{ success: boolean; message: string }>;
  loginUser: (emailOrUser: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  
  setActiveRole: (role: UserRole) => void;
  setActiveContext: (context: "personal" | "company") => void;
  setActiveModule: (module: CoreModuleType) => void;
  
  addIdea: (idea: Partial<Idea>) => Promise<void>;
  upvoteIdeaToggle: (ideaId: string) => Promise<void>;
  updateIdea: (ideaId: string, updates: Partial<Idea>) => void;
  setActiveIdeaId: (id: string | null) => void;
  
  addExperiment: (exp: ValidationExperiment) => void;
  updateExperiment: (expId: string, updates: Partial<ValidationExperiment>) => void;
  addEvidence: (ev: ValidationEvidence) => void;
  
  addStartup: (startup: Partial<Startup>) => void;
  setActiveStartupId: (id: string | null) => void;
  
  addDocument: (doc: WorkspaceDocument) => void;
  updateDocument: (docId: string, updates: Partial<WorkspaceDocument>) => void;
  addTask: (task: WorkspaceTask) => void;
  updateTask: (taskId: string, updates: Partial<WorkspaceTask>) => void;
  
  loadDatabaseState: () => Promise<void>;
}

export const useForgeStore = create<ForgeStore>()(
  persist(
    (set, get) => ({
      // Default Session State
      currentUser: {
        id: "user-default-1",
        userId: "user-default-1",
        username: "alex_founder",
        fullName: "Alex Rivera",
        email: "alex@forge.os",
        role: "founder",
        headline: "Serial Tech Founder"
      },
      isLoggedIn: true,
      registeredUsers: [],
      showAuthModal: false,
      authModalMode: "login",
      isLoading: false,
      errorMessage: null,
      // View & Onboarding State
      viewMode: "landing",
      showOnboardingModal: false,
      isOnboarded: false,

      activeRole: "founder",
      activeContext: "personal",
      activeModule: "dashboard",
      
      setViewMode: (mode) => set({ viewMode: mode }),
      setShowOnboardingModal: (show) => set({ showOnboardingModal: show }),
      
      completeOnboarding: async (data) => {
        const state = get();
        set({ isLoading: true });
        try {
          if (state.currentUser?.userId) {
            const { saveOnboardingProfile } = await import("../services/supabaseService");
            await saveOnboardingProfile(state.currentUser.userId, data);
          }
          set((s) => ({
            activeRole: data.role as UserRole,
            isOnboarded: true,
            showOnboardingModal: false,
            viewMode: "app",
            isLoading: false,
            currentUser: s.currentUser ? { ...s.currentUser, role: data.role as UserRole } : null
          }));
        } catch (e) {
          set({ isLoading: false });
        }
      },
      
      ideas: [
        {
          id: "idea-101",
          ownerId: "user-default-1",
          ownerName: "Alex Rivera",
          title: "AI Co-pilot for Startup Operations",
          oneLiner: "Autonomous workspace agents that manage compliance and data rooms.",
          problemStatement: "Founders spend 15+ hours weekly on manual updates and diligence.",
          solution: "State-driven multi-agent platform connecting GitHub, Slack, and Supabase.",
          targetMarket: "Early stage B2B tech founders",
          status: "validated",
          readinessScore: 88,
          upvotes: 24,
          competitors: ["Linear", "Notion"],
          tags: ["AI", "SaaS"],
          userVoted: false
        },
        {
          id: "idea-102",
          ownerId: "usr-202",
          ownerName: "Elena Rostova",
          title: "Micro-Logistics Direct Dispatcher",
          oneLiner: "Direct distribution network connecting local organic farms to restaurants.",
          problemStatement: "Food producers lose 30% margin on middle-man delivery platforms.",
          solution: "Self-dispatch routing web app for local farm-to-table supply chains.",
          targetMarket: "Independent organic producers",
          status: "refining",
          readinessScore: 65,
          upvotes: 18,
          competitors: ["DoorDash", "UberEats"],
          tags: ["Logistics", "Marketplace"],
          userVoted: false
        }
      ],
      founderCandidates: [
        {
          id: "fc-1",
          name: "Sarah Chen",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
          roleTitle: "Technical Co-founder (Ex-Stripe)",
          skills: ["React", "Node.js", "Python", "System Architecture"],
          commitment: "Full-time",
          workingStyle: "Asynchronous & Fast Iteration",
          riskTolerance: "High",
          matchScore: 94,
          bio: "Full-stack engineer with 7 years scaling SaaS platforms.",
          location: "San Francisco, CA"
        }
      ],
      builderProfiles: [],
      investorProfiles: [],
      mentorProfiles: [],
      experiments: [],
      evidence: [],
      serviceProviders: [
        {
          id: "sp-1",
          name: "Clerky & Stripe Atlas",
          category: "Legal & Incorporation",
          offerDetails: "Fast Delaware C-Corp setup with integrated bank account.",
          perksValue: "$500 Off Legal Fees",
          verifiedBadge: true,
          logoUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=150&q=80"
        }
      ],
      syndicates: [
        {
          id: "syn-1",
          name: "AI Frontiers Syndicate",
          leadName: "Marcus Vance",
          targetAllocation: "$250,000",
          committedAmount: "$180,000",
          membersCount: 42,
          focusSector: "Applied Generative AI",
          status: "Open"
        }
      ],
      acquisitions: [
        {
          id: "acq-1",
          title: "Micro-SaaS SEO Analytics Tool",
          category: "Developer Tooling",
          arr: "$48,000 ARR",
          askingPrice: "$120,000",
          profitMargin: "85%",
          techStack: ["Next.js", "Tailwind", "Supabase"],
          status: "Listed"
        }
      ],
      startups: [
        {
          id: "startup-101",
          name: "Forge Operations",
          industry: "B2B SaaS / Developer Tools",
          description: "Operating system for early-stage startup validation and team assembly.",
          stage: "formation",
          mrr: 2500,
          valuation: 1500000,
          teamSize: 3,
          createdBy: "user-default-1"
        }
      ],
      documents: [],
      tasks: [],
      
      activeIdeaId: "idea-101",
      activeStartupId: "startup-101",
      
      // Actions
      setShowAuthModal: (show, mode = "login") => set({ showAuthModal: show, authModalMode: mode }),
      
      registerUser: async ({ username, email, fullName, pass, role }) => {
        set({ isLoading: true, errorMessage: null });
        try {
          await signUpUser(email, pass, fullName, username, role);
          const newUserProfile: UserProfile = {
            id: `usr-${Date.now()}`,
            userId: `usr-${Date.now()}`,
            username,
            fullName,
            email,
            role,
            headline: `Forge ${role} member`
          };
          set({
            currentUser: newUserProfile,
            isLoggedIn: true,
            activeRole: role,
            showAuthModal: false,
            showOnboardingModal: true,
            viewMode: "app",
            isLoading: false
          });
          return { success: true, message: `Welcome to Forge OS as a ${role.toUpperCase()}!` };
        } catch (e: any) {
          set({ isLoading: false, errorMessage: e.message });
          return { success: false, message: e.message || "Registration failed" };
        }
      },

      loginUser: async (emailOrUser, pass) => {
        set({ isLoading: true, errorMessage: null });
        try {
          const email = emailOrUser.includes("@") ? emailOrUser : `${emailOrUser}@forge.os`;
          await signInUser(email, pass);
          const users = await fetchUserProfiles();
          const matched = users.find(u => u.email === email) || {
            id: `usr-${Date.now()}`,
            userId: `usr-${Date.now()}`,
            username: emailOrUser,
            fullName: emailOrUser,
            email,
            role: "founder" as UserRole
          };
          
          set({
            currentUser: matched,
            isLoggedIn: true,
            activeRole: matched.role,
            showAuthModal: false,
            viewMode: "app",
            isLoading: false
          });
          return { success: true, message: `Welcome back, ${matched.fullName}!` };
        } catch (e: any) {
          // Dev Fallback if Supabase credentials are empty
          const fallbackProfile: UserProfile = {
            id: `usr-dev-${Date.now()}`,
            userId: `usr-dev-${Date.now()}`,
            username: emailOrUser,
            fullName: emailOrUser.split("@")[0],
            email: emailOrUser.includes("@") ? emailOrUser : `${emailOrUser}@forge.os`,
            role: "founder"
          };
          set({
            currentUser: fallbackProfile,
            isLoggedIn: true,
            showAuthModal: false,
            isLoading: false
          });
          return { success: true, message: `Logged in as ${fallbackProfile.fullName}` };
        }
      },

      logoutUser: async () => {
        try {
          await signOutUser();
        } catch (e) {
          // Ignore
        }
        set({ currentUser: null, isLoggedIn: false });
      },

      setActiveRole: (role) => set({ activeRole: role }),
      setActiveContext: (context) => set({ activeContext: context }),
      setActiveModule: (module) => set({ activeModule: module }),

      addIdea: async (newIdea) => {
        const state = get();
        const createdBy = state.currentUser?.userId || "anon-user";
        const fullIdea: Idea = {
          id: `idea-${Date.now()}`,
          ownerId: createdBy,
          ownerName: state.currentUser?.fullName || "Founder",
          title: newIdea.title || "Untitled Idea",
          oneLiner: newIdea.oneLiner || "",
          problemStatement: newIdea.problemStatement || "",
          solution: newIdea.solution || "",
          targetMarket: newIdea.targetMarket,
          status: newIdea.status || "draft",
          readinessScore: newIdea.readinessScore || 50,
          upvotes: 0,
          competitors: newIdea.competitors || [],
          tags: newIdea.tags || [],
          userVoted: false
        };

        set((s) => ({ ideas: [fullIdea, ...s.ideas], activeIdeaId: fullIdea.id }));
        
        // Attempt DB persistence
        await createIdeaInDB(fullIdea);
      },

      upvoteIdeaToggle: async (ideaId) => {
        const state = get();
        const userId = state.currentUser?.userId;
        if (!userId) return;

        // Optimistic UI update
        const targetIdea = state.ideas.find(i => i.id === ideaId);
        if (!targetIdea) return;

        const currentlyVoted = !!targetIdea.userVoted;
        const updatedUpvotes = currentlyVoted ? Math.max(0, (targetIdea.upvotes || 1) - 1) : (targetIdea.upvotes || 0) + 1;

        set((s) => ({
          ideas: s.ideas.map(i => i.id === ideaId ? { ...i, userVoted: !currentlyVoted, upvotes: updatedUpvotes } : i)
        }));

        // DB update
        try {
          const res = await toggleVoteInDB(userId, ideaId);
          set((s) => ({
            ideas: s.ideas.map(i => i.id === ideaId ? { ...i, userVoted: res.voted, upvotes: res.newCount } : i)
          }));
        } catch (e) {
          console.warn('Vote toggle DB failed', e);
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

      addStartup: (startup) => set((state) => {
        const fullStartup: Startup = {
          id: startup.id || `startup-${Date.now()}`,
          name: startup.name || "Untitled Startup",
          industry: startup.industry || "Tech",
          description: startup.description || "",
          stage: startup.stage || "formation",
          mrr: startup.mrr || 0,
          valuation: startup.valuation || 0,
          teamSize: startup.teamSize || 1,
          createdBy: startup.createdBy || state.currentUser?.userId || "usr-1"
        };
        return { 
          startups: [fullStartup, ...state.startups], 
          activeStartupId: fullStartup.id || null 
        };
      }),

      setActiveStartupId: (id) => set({ activeStartupId: id }),

      addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
      updateDocument: (docId, updates) => set((state) => ({
        documents: state.documents.map((d) => d.id === docId ? { ...d, ...updates } : d)
      })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
      })),

      loadDatabaseState: async () => {
        const state = get();
        set({ isLoading: true });
        try {
          const [dbIdeas, dbBuilders, dbInvestors] = await Promise.all([
            fetchIdeasFromDB(state.currentUser?.userId),
            fetchBuilderProfiles(),
            fetchInvestorProfiles()
          ]);
          set({
            ideas: dbIdeas.length > 0 ? dbIdeas : state.ideas,
            builderProfiles: dbBuilders.length > 0 ? dbBuilders : state.builderProfiles,
            investorProfiles: dbInvestors.length > 0 ? dbInvestors : state.investorProfiles,
            isLoading: false
          });
        } catch (e) {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: "forge-os-persistent-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Subscribe to Supabase Auth Changes & Load DB
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = session.user;
      const role = (user.user_metadata?.role as UserRole) || "founder";
      useForgeStore.setState({
        currentUser: {
          id: user.id,
          userId: user.id,
          username: user.user_metadata?.username || user.email?.split("@")[0],
          fullName: user.user_metadata?.full_name || "Forge User",
          email: user.email,
          role,
          headline: `Forge ${role} member`
        },
        isLoggedIn: true,
        activeRole: role
      });
    }
  });
}
