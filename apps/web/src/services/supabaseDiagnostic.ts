/**
 * supabaseDiagnostic.ts
 *
 * Persistence-layer diagnostic tool for Project FORGE.
 *
 * Runs every INSERT / UPDATE / SELECT that the onboarding flow depends on,
 * logs the raw Supabase response (data, error, status, statusText), and
 * classifies the failure type (RLS, missing column, wrong key, etc.).
 *
 * Call runPersistenceDiagnostic() from the browser console or from the
 * DiagnosticPanel component.
 */

import { supabase } from './supabaseService';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckStatus = 'PASS' | 'FAIL' | 'SKIP' | 'WARN';

export interface DiagnosticCheck {
  id: string;
  label: string;
  status: CheckStatus;
  /** Raw Supabase response data (stringified) */
  data: string | null;
  /** Supabase error object */
  error: string | null;
  /** HTTP status code from PostgREST */
  httpStatus: number | null;
  /** Human-readable failure classification */
  diagnosis: string | null;
  /** Duration in ms */
  durationMs: number;
}

export interface DiagnosticReport {
  runAt: string;
  userId: string | null;
  userEmail: string | null;
  sessionActive: boolean;
  checks: DiagnosticCheck[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  /** SQL commands to fix identified RLS problems */
  sqlFixes: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function classifyError(error: any): string {
  if (!error) return 'No error';
  const code = error.code || '';
  const msg = (error.message || '').toLowerCase();
  const details = (error.details || '').toLowerCase();
  const hint = (error.hint || '').toLowerCase();

  if (code === 'PGRST116') return 'ROW_NOT_FOUND — no row matched the query (.single() returned 0 rows)';
  if (code === '42501' || msg.includes('permission denied') || msg.includes('rls')) {
    return 'RLS_VIOLATION — Row Level Security is blocking this operation. Add a policy for the authenticated role.';
  }
  if (code === '23503') return 'FOREIGN_KEY_VIOLATION — referenced row does not exist in the parent table';
  if (code === '23505') return 'UNIQUE_VIOLATION — a row with this primary key already exists';
  if (code === '42703') return `COLUMN_NOT_FOUND — column does not exist in table: ${msg}`;
  if (code === '42P01') return `TABLE_NOT_FOUND — table does not exist: ${msg}`;
  if (code === 'PGRST200') return 'RELATIONSHIP_NOT_FOUND — foreign key relationship not found by PostgREST';
  if (msg.includes('jwt') || msg.includes('token')) return 'AUTH_TOKEN_INVALID — JWT missing or expired. User not authenticated.';
  if (msg.includes('not authenticated') || msg.includes('anon')) return 'NOT_AUTHENTICATED — operation requires an authenticated session';
  if (details.includes('row-level security') || hint.includes('policy')) {
    return 'RLS_VIOLATION — Row Level Security is blocking this operation. Add/fix a policy.';
  }
  return `UNKNOWN_ERROR — code=${code} message=${error.message}`;
}

function buildRlsFix(table: string, operation: string): string {
  const op = operation.toUpperCase();
  return [
    `-- Fix: enable ${op} for authenticated users on ${table}`,
    `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`,
    `CREATE POLICY "authenticated_${op.toLowerCase()}_own_${table}"`,
    `  ON public.${table} FOR ${op}`,
    `  TO authenticated`,
    `  USING (${table === 'users' ? 'auth.uid() = id' : 'auth.uid() = user_id'})`,
    `  WITH CHECK (${table === 'users' ? 'auth.uid() = id' : 'auth.uid() = user_id'});`,
  ].join('\n');
}

async function runCheck(
  id: string,
  label: string,
  fn: () => Promise<{ data: any; error: any; status?: number; statusText?: string }>
): Promise<DiagnosticCheck> {
  const start = Date.now();
  try {
    const result = await fn();
    const durationMs = Date.now() - start;
    const error = result.error;
    const data = result.data;
    const httpStatus = result.status ?? null;

    const status: CheckStatus = error ? 'FAIL' : 'PASS';
    const diagnosis = error ? classifyError(error) : null;

    const check: DiagnosticCheck = {
      id,
      label,
      status,
      data: data !== null && data !== undefined ? JSON.stringify(data, null, 2) : null,
      error: error ? JSON.stringify({ code: error.code, message: error.message, details: error.details, hint: error.hint }, null, 2) : null,
      httpStatus,
      diagnosis,
      durationMs
    };

    // Console output
    const icon = status === 'PASS' ? '✅' : '❌';
    console.group(`${icon} [FORGE DIAG] ${id}: ${label} (${durationMs}ms)`);
    if (data !== null && data !== undefined) console.log('  data:', data);
    if (error) {
      console.error('  error:', error);
      console.warn('  diagnosis:', diagnosis);
    }
    if (httpStatus) console.log('  httpStatus:', httpStatus);
    console.groupEnd();

    return check;
  } catch (thrown: any) {
    const durationMs = Date.now() - start;
    const check: DiagnosticCheck = {
      id,
      label,
      status: 'FAIL',
      data: null,
      error: JSON.stringify({ message: thrown.message }),
      httpStatus: null,
      diagnosis: `THROWN_EXCEPTION — ${thrown.message}`,
      durationMs
    };
    console.error(`❌ [FORGE DIAG] ${id}: ${label} threw exception:`, thrown);
    return check;
  }
}

// ─── Main Diagnostic Runner ───────────────────────────────────────────────────

export async function runPersistenceDiagnostic(): Promise<DiagnosticReport> {
  console.group('🔬 [FORGE PERSISTENCE DIAGNOSTIC] Starting run...');
  const checks: DiagnosticCheck[] = [];
  const sqlFixes: string[] = [];

  // ── 0. Verify Auth Session ────────────────────────────────────────────────
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const userId = session?.user?.id ?? null;
  const userEmail = session?.user?.email ?? null;
  const sessionActive = Boolean(session && !sessionError);

  const sessionCheck: DiagnosticCheck = {
    id: 'AUTH_SESSION',
    label: 'Active Supabase session',
    status: sessionActive ? 'PASS' : 'FAIL',
    data: session ? JSON.stringify({ userId, email: userEmail, expiresAt: session.expires_at }, null, 2) : null,
    error: sessionError ? JSON.stringify(sessionError) : (!sessionActive ? '{"message":"No active session found"}' : null),
    httpStatus: null,
    diagnosis: sessionActive ? null : 'NOT_AUTHENTICATED — No valid session. User must be logged in to run persistence checks.',
    durationMs: 0
  };
  checks.push(sessionCheck);
  if (!sessionActive) {
    console.warn('[FORGE DIAG] ⚠️  No active session. Persistence checks require an authenticated user. Log in first.');
  }
  console.log('[FORGE DIAG] Session:', { userId, userEmail, sessionActive });

  // ── 1. SELECT public.users (read own row) ─────────────────────────────────
  const selectUsersCheck = await runCheck(
    'SELECT_USERS',
    `SELECT from public.users WHERE id = '${userId}'`,
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId — session not active' } };
      return supabase.from('users').select('id, email, role, onboarding_complete, profile_completed, username, full_name, updated_at').eq('id', userId).single();
    }
  );
  checks.push(selectUsersCheck);
  if (selectUsersCheck.status === 'FAIL') {
    sqlFixes.push(buildRlsFix('users', 'select'));
  }

  // ── 2. INSERT public.users (upsert own row) ───────────────────────────────
  const insertUsersCheck = await runCheck(
    'UPSERT_USERS',
    'UPSERT into public.users (id, email, username, full_name, onboarding_complete)',
    async () => {
      if (!userId || !userEmail) return { data: null, error: { code: 'SKIP', message: 'No userId/email' } };
      const username = userEmail.split('@')[0];
      return supabase.from('users').upsert(
        { id: userId, email: userEmail, username, full_name: username, onboarding_complete: false },
        { onConflict: 'id', ignoreDuplicates: true }
      ).select();
    }
  );
  checks.push(insertUsersCheck);
  if (insertUsersCheck.status === 'FAIL') {
    sqlFixes.push(buildRlsFix('users', 'insert'));
  }

  // ── 3. UPDATE public.users.role ───────────────────────────────────────────
  const updateRoleCheck = await runCheck(
    'UPDATE_USERS_ROLE',
    "UPDATE public.users SET role = 'founder' (diagnostic test — will revert)",
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId' } };
      // Read current role first so we can restore it
      const { data: current } = await supabase.from('users').select('role').eq('id', userId).single();
      const currentRole = current?.role ?? null;

      const result = await supabase.from('users')
        .update({ role: 'founder', updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select();

      // Restore original role if it existed before the test
      if (!result.error && currentRole) {
        await supabase.from('users').update({ role: currentRole }).eq('id', userId);
      }
      return result;
    }
  );
  checks.push(updateRoleCheck);
  if (updateRoleCheck.status === 'FAIL') {
    sqlFixes.push(buildRlsFix('users', 'update'));
  }

  // ── 4. UPDATE public.users.onboarding_complete ────────────────────────────
  const updateOnboardingCheck = await runCheck(
    'UPDATE_USERS_ONBOARDING',
    'UPDATE public.users SET onboarding_complete = true (diagnostic — reads current value, writes true, verifies)',
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId' } };
      // Read current value
      const { data: before } = await supabase.from('users').select('onboarding_complete').eq('id', userId).single();

      const result = await supabase.from('users')
        .update({ onboarding_complete: true, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select('id, onboarding_complete, profile_completed, role');

      // Log before/after
      if (!result.error && result.data) {
        console.log('[FORGE DIAG] onboarding_complete before:', before?.onboarding_complete, '→ after:', result.data[0]?.onboarding_complete);
      }
      return result;
    }
  );
  checks.push(updateOnboardingCheck);
  if (updateOnboardingCheck.status === 'FAIL') {
    sqlFixes.push(buildRlsFix('users', 'update'));
  }

  // ── 5. UPDATE public.users.profile_completed ──────────────────────────────
  const updateProfileCompletedCheck = await runCheck(
    'UPDATE_USERS_PROFILE_COMPLETED',
    'UPDATE public.users SET profile_completed = true',
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId' } };
      return supabase.from('users')
        .update({ profile_completed: true, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select('id, profile_completed');
    }
  );
  checks.push(updateProfileCompletedCheck);

  // ── 6. UPSERT public.profiles ─────────────────────────────────────────────
  const upsertProfilesCheck = await runCheck(
    'UPSERT_PROFILES',
    'UPSERT into public.profiles (user_id, location)',
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId' } };
      return supabase.from('profiles')
        .upsert({ user_id: userId, location: 'Diagnostic Test Location' }, { onConflict: 'user_id' })
        .select();
    }
  );
  checks.push(upsertProfilesCheck);
  if (upsertProfilesCheck.status === 'FAIL') {
    sqlFixes.push(buildRlsFix('profiles', 'insert'));
    sqlFixes.push(buildRlsFix('profiles', 'update'));
  }

  // ── 7. SELECT public.profiles ─────────────────────────────────────────────
  const selectProfilesCheck = await runCheck(
    'SELECT_PROFILES',
    `SELECT from public.profiles WHERE user_id = '${userId}'`,
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId' } };
      return supabase.from('profiles').select('user_id, location, github_url').eq('user_id', userId).single();
    }
  );
  checks.push(selectProfilesCheck);

  // ── 8. UPSERT public.founder_profiles ────────────────────────────────────
  const upsertFounderCheck = await runCheck(
    'UPSERT_FOUNDER_PROFILES',
    'UPSERT into public.founder_profiles (user_id, primary_industry)',
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId' } };
      return supabase.from('founder_profiles')
        .upsert({ user_id: userId, primary_industry: 'Diagnostic Test', commitment: 'Full-time' }, { onConflict: 'user_id' })
        .select();
    }
  );
  checks.push(upsertFounderCheck);
  if (upsertFounderCheck.status === 'FAIL') {
    sqlFixes.push(buildRlsFix('founder_profiles', 'insert'));
  }

  // ── 9. Full onboarding_complete write + re-read verification ─────────────
  const verifyRoundtripCheck = await runCheck(
    'ROUNDTRIP_VERIFY',
    'Write onboarding_complete=true + role=founder → re-read and verify DB reflects the change',
    async () => {
      if (!userId) return { data: null, error: { code: 'SKIP', message: 'No userId' } };

      await supabase.from('users').update({
        role: 'founder',
        onboarding_complete: true,
        profile_completed: true,
        updated_at: new Date().toISOString()
      }).eq('id', userId);

      // Re-read
      const readback = await supabase.from('users')
        .select('id, role, onboarding_complete, profile_completed')
        .eq('id', userId)
        .single();

      if (!readback.error && readback.data) {
        const { onboarding_complete, profile_completed, role } = readback.data;
        const allCorrect = onboarding_complete === true && profile_completed === true && role === 'founder';
        if (!allCorrect) {
          return {
            data: readback.data,
            error: {
              code: 'VERIFY_FAIL',
              message: `Round-trip failed. DB returned: onboarding_complete=${onboarding_complete}, profile_completed=${profile_completed}, role=${role}. Expected true/true/founder.`
            }
          };
        }
      }
      return readback;
    }
  );
  checks.push(verifyRoundtripCheck);

  // ── Build report ──────────────────────────────────────────────────────────
  const passed = checks.filter(c => c.status === 'PASS').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;
  const warnings = checks.filter(c => c.status === 'WARN').length;

  const report: DiagnosticReport = {
    runAt: new Date().toISOString(),
    userId,
    userEmail,
    sessionActive,
    checks,
    summary: { total: checks.length, passed, failed, warnings },
    sqlFixes: [...new Set(sqlFixes)] // deduplicate
  };

  // Final console summary
  console.log('\n📋 [FORGE DIAG] ─── SUMMARY ────────────────────────────────');
  console.log(`   Session active : ${sessionActive ? '✅ YES' : '❌ NO'}`);
  console.log(`   User ID        : ${userId ?? '(none)'}`);
  console.log(`   Checks         : ${passed}/${checks.length} passed, ${failed} failed, ${warnings} warnings`);

  if (failed > 0) {
    console.group('\n🔧 [FORGE DIAG] SQL to fix RLS / policy issues:');
    report.sqlFixes.forEach(sql => console.log(sql + '\n'));
    console.groupEnd();

    console.group('\n⚠️  [FORGE DIAG] Failed checks:');
    checks.filter(c => c.status === 'FAIL').forEach(c => {
      console.log(`  ❌ ${c.id}: ${c.label}`);
      console.log(`     diagnosis: ${c.diagnosis}`);
      if (c.error) console.log(`     error:`, JSON.parse(c.error));
    });
    console.groupEnd();
  } else {
    console.log('\n🎉 [FORGE DIAG] All persistence checks passed! DB writes are working.');
  }

  console.groupEnd();
  return report;
}

