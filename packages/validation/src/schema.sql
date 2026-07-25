-- ============================================================================
-- PROJECT FORGE PRODUCTION DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- Roles supported: founder, builder, investor, mentor, admin
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('founder', 'builder', 'investor', 'mentor', 'admin')),
    onboarding_complete BOOLEAN DEFAULT FALSE,
    profile_completed BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE (Core User Metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    headline TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FOUNDER PROFILES
CREATE TABLE IF NOT EXISTS public.founder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    startups_created_count INT DEFAULT 0,
    funding_raised_total NUMERIC DEFAULT 0.0,
    primary_industry TEXT,
    commitment TEXT CHECK (commitment IN ('Full-time', 'Part-time', 'Exploring')) DEFAULT 'Full-time',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUILDER PROFILES
CREATE TABLE IF NOT EXISTS public.builder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    primary_skills TEXT[] NOT NULL DEFAULT '{}',
    hourly_rate NUMERIC DEFAULT 0.0,
    equity_preference TEXT DEFAULT 'Equity + Cash',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    completed_missions INT DEFAULT 0,
    portfolio_links TEXT[] DEFAULT '{}',
    availability_status TEXT DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVESTOR PROFILES
CREATE TABLE IF NOT EXISTS public.investor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    firm_name TEXT,
    investor_type TEXT CHECK (investor_type IN ('Angel', 'VC', 'Syndicate', 'Family Office')) DEFAULT 'Angel',
    check_size_range TEXT DEFAULT '$10k - $50k',
    preferred_stages TEXT[] DEFAULT '{"Pre-Seed", "Seed"}',
    investment_theses TEXT[] DEFAULT '{}',
    portfolio_count INT DEFAULT 0,
    accredited_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MENTOR PROFILES
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expertise_areas TEXT[] DEFAULT '{}',
    years_experience INT DEFAULT 5,
    company_history TEXT[] DEFAULT '{}',
    hourly_rate NUMERIC DEFAULT 0.0,
    pro_bono_available BOOLEAN DEFAULT TRUE,
    total_sessions_conducted INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. IDEAS TABLE
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    one_liner TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    solution TEXT NOT NULL,
    target_market TEXT,
    icp TEXT,
    status TEXT CHECK (status IN ('draft', 'refining', 'validated', 'archived')) DEFAULT 'draft',
    readiness_score INT DEFAULT 0 CHECK (readiness_score BETWEEN 0 AND 100),
    upvotes INT DEFAULT 0,
    competitors TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STARTUPS TABLE
CREATE TABLE IF NOT EXISTS public.startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    industry TEXT NOT NULL,
    description TEXT NOT NULL,
    stage TEXT CHECK (stage IN ('ideation', 'validation', 'formation', 'operation', 'growth', 'exit')) DEFAULT 'formation',
    mrr NUMERIC DEFAULT 0.0,
    valuation NUMERIC DEFAULT 0.0,
    team_size INT DEFAULT 1,
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    budget_range TEXT,
    equity_offered TEXT,
    status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_rate TEXT,
    status TEXT CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FUNDING TABLE
CREATE TABLE IF NOT EXISTS public.funding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    round_type TEXT CHECK (round_type IN ('Pre-Seed', 'Seed', 'Series A', 'Syndicate')) DEFAULT 'Seed',
    equity_percentage NUMERIC(5, 2),
    status TEXT CHECK (status IN ('committed', 'transferred', 'pending_diligence')) DEFAULT 'committed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    equity_share NUMERIC(5, 2) DEFAULT 0.0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(startup_id, user_id)
);

-- 13. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. VOTES TABLE (Single Vote Enforced via Unique Constraint)
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, idea_id)
);

-- 16. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_type TEXT CHECK (item_type IN ('idea', 'startup', 'builder', 'investor', 'project')) NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 17. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('succeeded', 'pending', 'failed')) DEFAULT 'succeeded',
    payment_method TEXT DEFAULT 'Stripe',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. AI HISTORY TABLE (Stores user AI conversations & LangGraph validation runs)
CREATE TABLE IF NOT EXISTS public.ai_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    prompt_type TEXT NOT NULL,
    prompt_content TEXT NOT NULL,
    response_content JSONB NOT NULL,
    provider_used TEXT DEFAULT 'groq',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_ideas_owner ON public.ideas(owner_id);
CREATE INDEX IF NOT EXISTS idx_startups_creator ON public.startups(created_by);
CREATE INDEX IF NOT EXISTS idx_votes_user_idea ON public.votes(user_id, idea_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_ai_history_user ON public.ai_history(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active ideas & startups
CREATE POLICY "Public Read Ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Public Read Startups" ON public.startups FOR SELECT USING (true);
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);

-- Authenticated Users can create Ideas & Startups
CREATE POLICY "Auth Create Ideas" ON public.ideas FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Auth Update Own Ideas" ON public.ideas FOR UPDATE USING (auth.uid() = owner_id);

-- Voting: Users can insert vote if authenticated and owner of vote
CREATE POLICY "Auth Insert Vote" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth Delete Vote" ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Messages: Users can see messages sent to or by them
CREATE POLICY "Own Messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Send Messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- AI History: Users can view & save their own AI conversations
CREATE POLICY "Own AI History" ON public.ai_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Save AI History" ON public.ai_history FOR INSERT WITH CHECK (auth.uid() = user_id);
