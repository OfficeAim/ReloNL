import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// ReloNL — Edge Function: log-events
// Accepts a batch of client-side log events and persists them.
// Called from ReloLogger in Phase 2 (replace localStorage batch).
//
// POST /functions/v1/log-events
// Body: { events: LogEntry[] }
// ============================================================

interface LogEntry {
  ts: string;
  eventType: string;
  data: Record<string, unknown>;
  userId: string;
  sessionId: string;
  appVersion: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://relonl.nl', // update to production domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { events } = await req.json() as { events: LogEntry[] };

    if (!Array.isArray(events) || events.length === 0) {
      return new Response(JSON.stringify({ error: 'events array required' }), {
        status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // Limit batch size
    const batch = events.slice(0, 100);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rows = batch.map((e) => ({
      created_at: e.ts,
      user_id: e.userId,
      session_id: e.sessionId,
      event_type: e.eventType,
      payload: e.data,
      app_version: e.appVersion ?? '1.0-minimax'
    }));

    const { error } = await supabase.from('client_logs').insert(rows);

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true, count: rows.length }), {
      status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
});
