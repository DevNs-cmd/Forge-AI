import { createClient } from '@supabase/supabase-js';
import { 
  Idea, 
  Startup, 
  UserProfile, 
  BuilderProfile, 
  InvestorProfile, 
  MentorProfile,
  Project,
  Application,
  WorkspaceDocument,
  WorkspaceTask,
  UserRole
} from '@project-forge/validation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- AUTHENTICATION SERVICES & ERROR HANDLING ---

export const formatAuthError = (error: any): string => {
  if (!error) return "An unexpected error occurred. Please try again.";
  const msg = typeof error === 'string' ? error : (error.message || String(error));
  
  if (msg.includes("email rate limit exceeded") || msg.includes("rate_limit")) {
    return "We've recently sent a verification email. Please wait a few minutes before requesting another one.";
  }
  if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  if (msg.includes("User already registered") || msg.includes("already_exists")) {
    return "An account with this email address already exists. Please log in instead.";
  }
  if (msg.includes("Email not confirmed") || msg.includes("unconfirmed")) {
    return "Please check your inbox and verify your email address before logging in.";
  }
  if (msg.includes("Password should be at least")) {
    return "Your password must be at least 6 characters long.";
  }
  if (msg.includes("Unable to validate email address")) {
    return "Please enter a valid email address.";
  }
  return msg;
};

export const signUpUser = async (email: string, password: string, fullName: string, username: string, role: UserRole) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
          role
        }
      }
    });
    if (error) throw error;
    
    if (data.user) {
      const userId = data.user.id;

      // 1. Insert/Upsert in public.users
      await supabase.from('users').upsert({
        id: userId,
        email,
        username,
        full_name: fullName,
        role
      });

      // 2. Insert in public.profiles
      await supabase.from('profiles').upsert({
        user_id: userId,
        location: 'San Francisco, CA'
      });

      // 3. Insert in Role-Specific Profile Table
      if (role === 'founder') {
        await supabase.from('founder_profiles').upsert({
          user_id: userId,
          primary_industry: 'B2B SaaS',
          commitment: 'Full-time'
        });
      } else if (role === 'builder') {
        await supabase.from('builder_profiles').upsert({
          user_id: userId,
          title: 'Full Stack Engineer',
          primary_skills: ['TypeScript', 'React', 'Node.js']
        });
      } else if (role === 'investor') {
        await supabase.from('investor_profiles').upsert({
          user_id: userId,
          investor_type: 'Angel',
          check_size_range: '$25k - $100k'
        });
      } else if (role === 'mentor') {
        await supabase.from('mentor_profiles').upsert({
          user_id: userId,
          years_experience: 5
        });
      }

      // 4. Activity Log
      await supabase.from('activities').insert({
        user_id: userId,
        action: 'user_registered',
        entity_type: 'user',
        metadata: { role }
      });
    }
    return data;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined
      }
    });
    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
};

export const ensureUserProfileExists = async (user: any): Promise<UserProfile> => {
  // First attempt: read the existing profile from the DB
  let profile = await getCurrentUserProfile(user.id);
  if (profile) return profile;

  // Profile not found. Create a new row — but use ignoreDuplicates:true so we
  // NEVER overwrite an existing row's onboarding_complete, role, or any other
  // saved field. This protects users who completed onboarding from being reset.
  const email = user.email || '';
  const username = user.user_metadata?.username || email.split('@')[0] || `user_${Date.now()}`;
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || username;

  await supabase.from('users').upsert(
    {
      id: user.id,
      email,
      username,
      full_name: fullName,
      onboarding_complete: false   // only applied on first INSERT, never on UPDATE
    },
    { onConflict: 'id', ignoreDuplicates: true }  // if row exists, do nothing
  );

  await supabase.from('profiles').upsert(
    { user_id: user.id, location: 'San Francisco, CA' },
    { onConflict: 'user_id', ignoreDuplicates: true }
  );

  // Re-fetch after the upsert. If the upsert was a no-op (row already existed
  // but getCurrentUserProfile missed it on the first try), this will return the
  // real DB values — including onboarding_complete:true for returning users.
  const refetched = await getCurrentUserProfile(user.id);
  if (refetched) return refetched;

  // Absolute fallback: brand-new user whose row was just inserted
  return {
    id: user.id,
    userId: user.id,
    username,
    fullName,
    email,
    onboardingComplete: false,
    profileCompleted: false
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const saveOnboardingProfile = async (userId: string, data: any) => {
  const role = data.role as UserRole;
  
  // 1. Update public.users: role, onboarding_complete = true, profile_completed = true, updated_at
  const { error: updateError } = await supabase.from('users').update({ 
    role,
    onboarding_complete: true,
    profile_completed: true,
    updated_at: new Date().toISOString()
  }).eq('id', userId);

  // Surface the error immediately — if this update fails silently, the user will
  // see onboarding on every login because onboarding_complete stays false in DB.
  if (updateError) {
    console.error('[saveOnboardingProfile] Failed to update users table:', updateError);
    throw new Error(`Failed to save onboarding: ${updateError.message}`);
  }
  
  // 2. Update public.profiles
  await supabase.from('profiles').upsert({
    user_id: userId,
    location: data.location || 'San Francisco, CA',
    github_url: data.portfolioLink || null
  });

  // 3. Update role-specific table
  if (role === 'founder') {
    await supabase.from('founder_profiles').upsert({
      user_id: userId,
      primary_industry: data.industry || 'B2B SaaS',
      commitment: 'Full-time'
    });
    if (data.startupName) {
      await supabase.from('startups').insert({
        created_by: userId,
        name: data.startupName,
        industry: data.industry || 'B2B SaaS',
        description: `New ${data.industry || 'B2B SaaS'} startup on Forge OS.`,
        stage: data.stage || 'formation',
        team_size: data.teamSize || 1
      });
    }
  } else if (role === 'builder') {
    await supabase.from('builder_profiles').upsert({
      user_id: userId,
      title: data.experienceLevel ? `Builder (${data.experienceLevel})` : 'Software Builder',
      primary_skills: data.primarySkills ? data.primarySkills.split(',').map((s: string) => s.trim()) : ['TypeScript', 'React'],
      equity_preference: 'Equity + Cash',
      availability_status: data.availability || 'Available',
      portfolio_links: data.portfolioLink ? [data.portfolioLink] : []
    });
  } else if (role === 'investor') {
    await supabase.from('investor_profiles').upsert({
      user_id: userId,
      investor_type: data.investorType || 'Angel',
      check_size_range: data.checkSize || '$25k - $100k',
      preferred_stages: data.preferredStages ? data.preferredStages.split(',').map((s: string) => s.trim()) : ['Pre-Seed', 'Seed'],
      investment_theses: data.preferredIndustries ? data.preferredIndustries.split(',').map((s: string) => s.trim()) : ['AI', 'SaaS']
    });
  }
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      role: newRole,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  if (error) throw error;
  return data;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const getCurrentUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      userId: data.id,
      username: data.username || data.email?.split('@')[0] || 'user',
      fullName: data.full_name || 'Forge Member',
      email: data.email,
      role: data.role || undefined,
      // Read each flag independently from the DB — do NOT coerce or fallback to the other flag
      onboardingComplete: Boolean(data.onboarding_complete),
      profileCompleted: Boolean(data.profile_completed),
      avatarUrl: data.avatar_url,
      createdAt: data.created_at
    };
  } catch (e) {
    return null;
  }
};

export const subscribeToAuthChanges = (callback: (event: string, session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return subscription;
};

// --- DATA FETCHING & CRUD ---

export const fetchUserProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.warn('Error fetching users from Supabase:', error);
    return [];
  }
  return (data || []).map(u => ({
    id: u.id,
    userId: u.id,
    username: u.username,
    fullName: u.full_name,
    email: u.email,
    role: u.role,
    // Read each flag independently from the DB — do NOT coerce or fallback to the other flag
    onboardingComplete: Boolean(u.onboarding_complete),
    profileCompleted: Boolean(u.profile_completed),
    avatarUrl: u.avatar_url,
    createdAt: u.created_at
  }));
};

export const fetchBuilderProfiles = async (): Promise<BuilderProfile[]> => {
  const { data, error } = await supabase.from('builder_profiles').select('*');
  if (error) {
    console.warn('Error fetching builder profiles:', error);
    return [];
  }
  return (data || []).map(b => ({
    id: b.id,
    userId: b.user_id,
    name: b.title,
    title: b.title,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    primarySkills: b.primary_skills || [],
    hourlyRate: `$${b.hourly_rate}/hr`,
    equityPreference: b.equity_preference || 'Equity + Cash',
    rating: Number(b.rating || 5.0),
    completedMissions: b.completed_missions || 0,
    bio: 'Experienced developer built for high-growth tech startups.'
  }));
};

export const fetchInvestorProfiles = async (): Promise<InvestorProfile[]> => {
  const { data, error } = await supabase.from('investor_profiles').select('*');
  if (error) {
    console.warn('Error fetching investor profiles:', error);
    return [];
  }
  return (data || []).map(i => ({
    id: i.id,
    userId: i.user_id,
    name: i.firm_name || 'Angel Investor',
    firm: i.firm_name || 'Independent Syndicate',
    type: (i.investor_type as any) || 'Angel',
    checkSizeRange: i.check_size_range || '$10k - $50k',
    preferredStages: i.preferred_stages || ['Seed'],
    theses: i.investment_theses || ['AI / ML', 'SaaS'],
    portfolioCount: i.portfolio_count || 3,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    location: 'San Francisco, CA'
  }));
};

export const fetchIdeasFromDB = async (currentUserId?: string): Promise<Idea[]> => {
  const { data, error } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
  if (error) {
    console.warn('Error fetching ideas:', error);
    return [];
  }

  let userVotes = new Set<string>();
  if (currentUserId) {
    const { data: votes } = await supabase.from('votes').select('idea_id').eq('user_id', currentUserId);
    if (votes) {
      userVotes = new Set(votes.map(v => v.idea_id));
    }
  }

  return (data || []).map(i => ({
    id: i.id,
    ownerId: i.owner_id,
    ownerName: 'Forge Founder',
    title: i.title,
    oneLiner: i.one_liner,
    problemStatement: i.problem_statement,
    solution: i.solution,
    targetMarket: i.target_market,
    icp: i.icp,
    status: i.status || 'draft',
    readinessScore: i.readiness_score || 50,
    upvotes: i.upvotes || 0,
    competitors: i.competitors || [],
    tags: i.tags || [],
    userVoted: userVotes.has(i.id),
    createdAt: i.created_at
  }));
};

export const createIdeaInDB = async (idea: Partial<Idea>): Promise<Idea | null> => {
  const { data, error } = await supabase.from('ideas').insert({
    owner_id: idea.ownerId,
    title: idea.title,
    one_liner: idea.oneLiner,
    problem_statement: idea.problemStatement,
    solution: idea.solution,
    target_market: idea.targetMarket,
    icp: idea.icp,
    status: idea.status || 'draft',
    readiness_score: idea.readinessScore || 40,
    upvotes: 0
  }).select().single();

  if (error) {
    console.error('Error creating idea in DB:', error);
    return null;
  }
  return {
    id: data.id,
    ownerId: data.owner_id,
    title: data.title,
    oneLiner: data.one_liner,
    problemStatement: data.problem_statement,
    solution: data.solution,
    targetMarket: data.target_market,
    icp: data.icp,
    status: data.status,
    readinessScore: data.readiness_score,
    upvotes: data.upvotes,
    competitors: data.competitors || [],
    tags: data.tags || [],
    userVoted: false,
    createdAt: data.created_at
  };
};

// --- SINGLE VOTING TOGGLE LOGIC ---

export const toggleVoteInDB = async (userId: string, ideaId: string): Promise<{ voted: boolean; newCount: number }> => {
  // Check if vote already exists
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', userId)
    .eq('idea_id', ideaId)
    .maybeSingle();

  if (existingVote) {
    // Already voted -> Remove vote
    await supabase.from('votes').delete().eq('id', existingVote.id);
    
    // Decrement upvotes
    const { data: updatedIdea } = await supabase
      .from('ideas')
      .select('upvotes')
      .eq('id', ideaId)
      .single();
      
    const newCount = Math.max(0, (updatedIdea?.upvotes || 1) - 1);
    await supabase.from('ideas').update({ upvotes: newCount }).eq('id', ideaId);
    
    return { voted: false, newCount };
  } else {
    // Insert single vote
    const { error } = await supabase.from('votes').insert({ user_id: userId, idea_id: ideaId });
    if (error) {
      console.warn('Single vote constraint violation or error:', error);
    }
    
    const { data: updatedIdea } = await supabase
      .from('ideas')
      .select('upvotes')
      .eq('id', ideaId)
      .single();
      
    const newCount = (updatedIdea?.upvotes || 0) + 1;
    await supabase.from('ideas').update({ upvotes: newCount }).eq('id', ideaId);
    
    return { voted: true, newCount };
  }
};

export const fetchStartupsFromDB = async (): Promise<Startup[]> => {
  const { data, error } = await supabase.from('startups').select('*');
  if (error) return [];
  return (data || []).map(s => ({
    id: s.id,
    name: s.name,
    logoUrl: s.logo_url,
    industry: s.industry,
    description: s.description,
    stage: s.stage || 'formation',
    mrr: Number(s.mrr || 0),
    valuation: Number(s.valuation || 0),
    teamSize: s.team_size || 1,
    createdBy: s.created_by,
    createdAt: s.created_at
  }));
};

// --- REALTIME SUBSCRIPTIONS ---

export const subscribeToRealtimeTable = (tableName: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`public:${tableName}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// --- AI HISTORY PERSISTENCE ---

export const saveAIConversation = async (
  userId: string,
  promptType: string,
  promptContent: string,
  responseContent: any,
  providerUsed: string = 'groq'
) => {
  try {
    const { data, error } = await supabase.from('ai_history').insert({
      user_id: userId,
      prompt_type: promptType,
      prompt_content: promptContent,
      response_content: responseContent,
      provider_used: providerUsed
    });
    if (error) console.warn('Error saving AI history:', error);
    return data;
  } catch (e) {
    console.warn('Error in saveAIConversation:', e);
  }
};

export const fetchUserAIHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('ai_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
};

// --- REAL DATABASE SEARCH ---

export const searchEntitiesInDB = async (searchQuery: string) => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return { ideas: [], startups: [], users: [] };
  }
  const q = `%${searchQuery.trim()}%`;
  
  const [ideasRes, startupsRes, usersRes] = await Promise.all([
    supabase.from('ideas').select('*').or(`title.ilike.${q},problem_statement.ilike.${q},solution.ilike.${q}`),
    supabase.from('startups').select('*').or(`name.ilike.${q},description.ilike.${q},industry.ilike.${q}`),
    supabase.from('users').select('*').or(`full_name.ilike.${q},username.ilike.${q},email.ilike.${q}`)
  ]);

  return {
    ideas: ideasRes.data || [],
    startups: startupsRes.data || [],
    users: usersRes.data || []
  };
};

// --- REAL ANALYTICS CALCULATIONS ---

export const fetchPlatformAnalytics = async () => {
  try {
    const [usersCount, startupsCount, ideasCount, votesCount, fundingRes] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('startups').select('id', { count: 'exact', head: true }),
      supabase.from('ideas').select('id', { count: 'exact', head: true }),
      supabase.from('votes').select('id', { count: 'exact', head: true }),
      supabase.from('funding').select('amount')
    ]);

    const totalFunding = (fundingRes.data || []).reduce((acc: number, f: any) => acc + Number(f.amount || 0), 0);

    return {
      totalUsers: usersCount.count || 0,
      totalStartups: startupsCount.count || 0,
      totalIdeas: ideasCount.count || 0,
      totalVotes: votesCount.count || 0,
      totalCapitalSyndicated: totalFunding
    };
  } catch (e) {
    return {
      totalUsers: 0,
      totalStartups: 0,
      totalIdeas: 0,
      totalVotes: 0,
      totalCapitalSyndicated: 0
    };
  }
};
