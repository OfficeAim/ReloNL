import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// ReloNL — Edge Function: auth-google
// Validates a Google ID Token and creates/retrieves a gem_account.
// Returns a session token for the Gems system.
//
// POST /functions/v1/auth-google
// Body: { credential: string }  ← Google ID Token from GSI
// ============================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://relonl.nl', // update to production domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleTokenPayload {
  sub: string;       // Google user ID
  email: string;
  name: string;
  picture: string;
  aud: string;       // must match CLIENT_ID
}

// Verify Google ID Token via Google's tokeninfo endpoint
async function verifyGoogleToken(credential: string, clientId: string): Promise<GoogleTokenPayload | null> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!res.ok) return null;
    const payload = await res.json() as GoogleTokenPayload;
    if (payload.aud !== clientId) return null;
    return payload;
  } catch {
    return null;
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { credential } = await req.json() as { credential: string };
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') ?? '';

    const payload = await verifyGoogleToken(credential, GOOGLE_CLIENT_ID);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Invalid Google token' }), {
        status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Upsert gem_account — create if new, return if existing
    const { data: account, error } = await supabase
      .from('gem_accounts')
      .upsert({
        google_id: payload.sub,
        email: payload.email,
        display_name: payload.name,
        avatar_url: payload.picture
      }, { onConflict: 'google_id', ignoreDuplicates: false })
      .select('id, balance, tier, created_at')
      .single();

    if (error) {
      console.error('Upsert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // First time user: log signup bonus transaction
    const isNewUser = new Date(account.created_at) > new Date(Date.now() - 5000);
    if (isNewUser) {
      await supabase.from('gem_transactions').insert({
        account_id: account.id,
        gem_feature: 'signup_bonus',
        delta: 3,
        note: 'Welcome to ReloNL Gems!'
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      account: {
        id: account.id,
        email: payload.email,
        displayName: payload.name,
        avatarUrl: payload.picture,
        balance: account.balance,
        tier: account.tier,
        isNewUser
      }
    }), {
      status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
});
