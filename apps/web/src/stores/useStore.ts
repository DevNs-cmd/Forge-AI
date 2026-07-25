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
  | "admin-os"
  | "settings";

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
  isAuthInitializing: boolean;
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
  aiHistory: any[];
  platformAnalytics: any;
  
  // Handles
  activeIdeaId: string | null;
  activeStartupId: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  setViewMode: (mode: "landing" | "app") => void;
  setShowOnboardingModal: (show: boolean) => void;
  completeOnboarding: (data: any) => Promise<void>;
  saveAiHistory: (promptType: string, promptContent: string, responseContent: any, providerUsed?: string) => Promise<void>;
  
  setShowAuthModal: (show: boolean, mode?: "login" | "register") => void;
  registerUser: (newUser: { username: string; email: string; fullName: string; pass: string; role?: UserRole }) => Promise<{ success: boolean; message: string }>;
  loginUser: (emailOrUser: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  
  setActiveRole: (role: UserRole) => void;
  changeUserRole: (newRole: UserRole) => Promise<void>;
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
      // Default Session State (Unauthenticated by default)
      currentUser: null,
      isLoggedIn: false,
      registeredUsers: [],
      showAuthModal: false,
      authModalMode: "login",
      isLoading: false,
      errorMessage: null,
      isAuthInitializing: true,
      
      // View & Onboarding State
      viewMode: "landing",
      showOnboardingModal: false,
      isOnboarded: false,

      // Datasets & Analytics
      aiHistory: [],
      platformAnalytics: null,

      activeRole: "founder",
      activeContext: "personal",
      activeModule: "dashboard",

      initializeAuth: async () => {
        set({ isAuthInitializing: true });
        try {
          const { getCurrentSession, getCurrentUserProfile, subscribeToAuthChanges } = await import("../services/supabaseService");
          const session = await getCurrentSession();
          
          if (session?.user) {
            const { ensureUserProfileExists } = await import("../services/supabaseService");
            const profile = await ensureUserProfileExists(session.user);
            const userRole: UserRole = profile.role || "founder";
            const isRoleComplete = Boolean(profile.onboardingComplete && profile.role);
            const targetModule: CoreModuleType = userRole === "mentor" ? "mentor-hub" : (userRole === "admin" ? "admin-os" : "dashboard");

            set({
              currentUser: profile,
              isLoggedIn: true,
              activeRole: userRole,
              activeModule: targetModule,
              viewMode: "app",
              showAuthModal: false,
              showOnboardingModal: !isRoleComplete,
              isAuthInitializing: false
            });
          } else {
            set({ currentUser: null, isLoggedIn: false, isAuthInitializing: false });
          }

          // Subscribe to auth state changes for seamless session restoration
          subscribeToAuthChanges(async (event, session) => {
            if (event === "SIGNED_OUT") {
              set({
                currentUser: null,
                isLoggedIn: false,
                viewMode: "landing",
                showAuthModal: false,
                showOnboardingModal: false
              });
            } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
              if (session?.user) {
                const { ensureUserProfileExists } = await import("../services/supabaseService");
                const profile = await ensureUserProfileExists(session.user);
                const userRole: UserRole = profile.role || "founder";
                const isRoleComplete = Boolean(profile.onboardingComplete && profile.role);
                const targetModule: CoreModuleType = userRole === "mentor" ? "mentor-hub" : (userRole === "admin" ? "admin-os" : "dashboard");
                set({
                  currentUser: profile,
                  isLoggedIn: true,
                  activeRole: userRole,
                  activeModule: targetModule,
                  viewMode: "app",
                  showAuthModal: false,
                  showOnboardingModal: !isRoleComplete,
                  isAuthInitializing: false
                });
              }
            }
          });
        } catch (e) {
          set({ isAuthInitializing: false });
        }
      },
      
      setViewMode: (mode) => set({ viewMode: mode }),
      setShowOnboardingModal: (show) => set({ showOnboardingModal: show }),
      
      completeOnboarding: async (data) => {
        const state = get();
        set({ isLoading: true });
        try {
          const role = (data.role || state.currentUser?.role || "founder") as UserRole;
          if (state.currentUser?.userId) {
            const { saveOnboardingProfile } = await import("../services/supabaseService");
            await saveOnboardingProfile(state.currentUser.userId, { ...data, role });
          }
          const targetModule: CoreModuleType = role === "admin" ? "admin-os" : (role === "mentor" ? "mentor-hub" : "dashboard");
          // Mirror the DB write back into local state so onboardingComplete/profileCompleted are
          // immediately true — future logins will read these values from Supabase directly.
          set((s) => ({
            activeRole: role,
            activeModule: targetModule,
            isOnboarded: true,
            showOnboardingModal: false,
            viewMode: "app",
            isLoading: false,
            currentUser: s.currentUser
              ? { ...s.currentUser, role, onboardingComplete: true, profileCompleted: true }
              : null
          }));
        } catch (e) {
          set({ isLoading: false });
        }
      },

      ideas: [],
      founderCandidates: [],
      builderProfiles: [],
      investorProfiles: [],
      mentorProfiles: [],
      experiments: [],
      evidence: [],
      serviceProviders: [],
      syndicates: [],
      acquisitions: [],
      startups: [],
      documents: [],
      tasks: [],
      
      activeIdeaId: null,
      activeStartupId: null,
      
      // Actions
      setShowAuthModal: (show, mode = "login") => set({ showAuthModal: show, authModalMode: mode }),
      
      registerUser: async ({ username, email, fullName, pass, role = "founder" }) => {
        set({ isLoading: true, errorMessage: null });
        try {
          await signUpUser(email, pass, fullName, username, "founder");
          const newUserProfile: UserProfile = {
            id: `usr-${Date.now()}`,
            userId: `usr-${Date.now()}`,
            username,
            fullName,
            email,
            onboardingComplete: false,
            profileCompleted: false
          };
          set({
            currentUser: newUserProfile,
            isLoggedIn: true,
            showAuthModal: false,
            showOnboardingModal: true,
            viewMode: "app",
            isLoading: false
          });
          return { success: true, message: `Account created successfully! Please complete your profile.` };
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
          // Load profile directly from DB — never inject default values
          const users = await fetchUserProfiles();
          const matched = users.find(u => u.email === email || u.username === emailOrUser);

          if (!matched) {
            // Profile not in DB yet (extremely rare edge case during sign-up race).
            // Let initializeAuth / subscribeToAuthChanges handle the state once the session settles.
            set({ isLoading: false });
            return { success: true, message: "Logging you in..." };
          }

          const userRole = matched.role || "founder";
          const needsOnboarding = !matched.onboardingComplete;
          const targetModule: CoreModuleType = userRole === "admin" ? "admin-os" : (userRole === "mentor" ? "mentor-hub" : "dashboard");

          set({
            currentUser: matched,
            isLoggedIn: true,
            activeRole: userRole,
            activeModule: targetModule,
            showAuthModal: false,
            showOnboardingModal: needsOnboarding,
            viewMode: "app",
            isLoading: false
          });
          return { success: true, message: `Welcome back, ${matched.fullName}!` };
        } catch (e: any) {
          set({ isLoading: false, errorMessage: e.message });
          return { success: false, message: e.message || "Authentication failed. Incorrect email or password." };
        }
      },

      logoutUser: async () => {
        try {
          await signOutUser();
        } catch (e) {
          // Ignore
        }
        set({ 
          currentUser: null, 
          isLoggedIn: false, 
          viewMode: "landing", 
          showAuthModal: false, 
          showOnboardingModal: false 
        });
      },

      setActiveRole: (role) => set({ activeRole: role }),
      changeUserRole: async (newRole: UserRole) => {
        const state = get();
        const userId = state.currentUser?.userId;
        if (!userId) return;

        const targetModule: CoreModuleType = newRole === "mentor" ? "mentor-hub" : (newRole === "admin" ? "admin-os" : "dashboard");
        set((s) => ({
          activeRole: newRole,
          activeModule: targetModule,
          currentUser: s.currentUser ? { ...s.currentUser, role: newRole } : null
        }));

        try {
          const { updateUserRole } = await import("../services/supabaseService");
          await updateUserRole(userId, newRole);
        } catch (e) {
          console.warn("Failed to persist role change in Supabase", e);
        }
      },
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

      saveAiHistory: async (promptType, promptContent, responseContent, providerUsed = "groq") => {
        const userId = get().currentUser?.userId;
        if (!userId) return;
        try {
          const { saveAIConversation, fetchUserAIHistory } = await import("../services/supabaseService");
          await saveAIConversation(userId, promptType, promptContent, responseContent, providerUsed);
          const history = await fetchUserAIHistory(userId);
          set({ aiHistory: history });
        } catch (e) {
          console.warn("Failed to save AI history:", e);
        }
      },

      loadDatabaseState: async () => {
        const state = get();
        set({ isLoading: true });
        try {
          const { 
            fetchIdeasFromDB, 
            fetchStartupsFromDB, 
            fetchBuilderProfiles, 
            fetchInvestorProfiles, 
            fetchUserAIHistory,
            fetchPlatformAnalytics,
            subscribeToRealtimeTable 
          } = await import("../services/supabaseService");

          const [dbIdeas, dbStartups, dbBuilders, dbInvestors, analytics] = await Promise.all([
            fetchIdeasFromDB(state.currentUser?.userId),
            fetchStartupsFromDB(),
            fetchBuilderProfiles(),
            fetchInvestorProfiles(),
            fetchPlatformAnalytics()
          ]);

          let userHistory: any[] = [];
          if (state.currentUser?.userId) {
            userHistory = await fetchUserAIHistory(state.currentUser.userId);
          }

          set({
            ideas: dbIdeas,
            startups: dbStartups,
            builderProfiles: dbBuilders,
            investorProfiles: dbInvestors,
            aiHistory: userHistory,
            platformAnalytics: analytics,
            isLoading: false
          });

          // Subscribe to Supabase Realtime table changes
          subscribeToRealtimeTable('ideas', () => {
            fetchIdeasFromDB(state.currentUser?.userId).then(ideas => set({ ideas }));
          });
          subscribeToRealtimeTable('startups', () => {
            fetchStartupsFromDB().then(startups => set({ startups }));
          });
          subscribeToRealtimeTable('votes', () => {
            fetchIdeasFromDB(state.currentUser?.userId).then(ideas => set({ ideas }));
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

// NOTE: Auth state changes are managed exclusively inside initializeAuth via
// subscribeToAuthChanges. A second raw onAuthStateChange listener here was
// removed because it raced with initializeAuth and always overwrote the store
// with hardcoded `onboardingComplete: false` defaults, causing the onboarding
// modal to appear on every login regardless of the Supabase DB value.
