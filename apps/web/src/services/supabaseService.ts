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

// --- AUTHENTICATION SERVICES ---

export const signUpUser = async (email: string, password: string, fullName: string, username: string, role: UserRole) => {
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
    // Insert into public users table
    await supabase.from('users').upsert({
      id: data.user.id,
      email,
      username,
      full_name: fullName,
      role
    });
  }
  return data;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
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
