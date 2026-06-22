# ReloNL — Implementation Status & Architecture Brief

**Live demo:** https://relo2nl.netlify.app
**File:** `index.html` (single-file, 88 KB, zero backend, zero build step)

---

## What Antigravity Should Know First

ReloNL is a **single-file static web app** built to solve the Dutch student housing crisis (kamernood) for international students. The current deliverable is the **MVP marketing + utility portal** — Tier 1 features are fully functional, Tier 2/3 are UI-complete with simulated backend logic.

**Production URL is live.** Treat this as the "ready to demo to universities and pilot landlords" build, not the production architecture.

---

## 1. Implementation Status by Tier

### ✅ Tier 1 — Fully Functional (no stubs)
| Module | Status | Persistence |
|---|---|---|
| AI Settings (9-city + origin country selectors) | ✅ Working | `localStorage` |
| Multi-step onboarding wizard (4 steps + email capture) | ✅ Working | `localStorage` |
| Pre-Arrival Solvency Dossier (3-step wizard) | ✅ Working | `localStorage` |
| Verified Tenant Badge (UUID + QR via QR Server API) | ✅ Working | `localStorage` |
| BSN Catch-22 infographic + 3 solutions | ✅ Static (visual) | — |
| Affiliate Partner link (3 placements, all with Partner badge) | ✅ Working | — |
| WWSO Calculator (9 inputs + radar chart + compliance status) | ✅ Working | — |
| WWSO PDF Export (jsPDF, downloadable) | ✅ Working | — |
| Landlord listing form | ✅ Working | `localStorage` |

### ✅ Tier 2 — UI-Complete with Functional Core
| Module | Status |
|---|---|
| Relocation Action Plan (16-step checklist + progress bar) | ✅ LocalStorage persistence |
| Rewards Marketplace (Bronze/Silver/Gold tiers + 6 redeemable items) | ✅ Digital items redeemable; physical items greyed "Phase 2" |
| Referral link generator (UUID-based) | ✅ Working |
| University White-Label B2B contact form | ✅ Form submission to LocalStorage |
| Area Guide (Green/Yellow/Red zones per city) | ✅ 9 cities, 25+ zones, dynamic city highlight |
| Smart Tracker (Chart.js scatter, sample + user-added data) | ✅ Working |
| Hospiteeravond Digitalizer (6 personality sliders + matching) | ✅ Sliders → profile + 3 house match cards |
| Monthly Expenses Simulator (5 sliders + bar chart) | ✅ Real-time |
| Premium Accommodations (6 partner cards + contact modal) | ✅ Working |

### ⚠️ Tier 3 — UI-Complete with Heuristic/Simulated Logic
| Module | Status |
|---|---|
| Scam Detector | ⚠️ Keyword heuristic (no API key required) |
| Letter Generator | ⚠️ Template-based, copy-to-clipboard |
| Legal Coach | ⚠️ Static FAQ accordion (no AI backend) |
| Immigration & Visa | ✅ Static content cards |
| BRP/BSN Registration Steps | ✅ Static content + city link |
| Trusted Platforms, Public Transport, Financial Setup, Apps | ✅ Static content |
| SEPA QR (€3.59 Coffee Test) | ✅ Real QR via QR Server API |

---

## 2. Architecture: Why Single-File (and When to Break It)

**Current state:** Everything inlined in `index.html` because:
- Deployment target is Netlify Drop / static CDN
- No backend logic exists yet (LocalStorage simulates persistence)
- Faster iteration on UX/marketing layers before adding infra

**Migration trigger:** When any of these become real:
- User accounts (requires DB)
- Actual WWSO submissions to Huurcommissie (requires auth + audit log)
- Multi-tenant landlord portal (requires DB + role-based access)
- Production B2B contracts (requires signed agreements + invoicing)

---

## 3. Backend Integration Points (Where Supabase / Google Auth Plug In)

Below is the suggested migration map. Each stub function in `index.html` has a comment marking where the network call should be inserted.

### 3.1 Google Auth (replace `submitB2B`, `dossierSubmit`, `simulateReferral`)

```javascript
// STUB: replace with real auth
function submitB2B() {
  // ... localStorage logic ...
}

// TARGET:
async function submitB2B() {
  const user = await window.gapi.auth2.getAuthInstance().signIn();
  const idToken = user.getAuthResponse().id_token;
  const res = await fetch('https://<project>.supabase.co/functions/v1/b2b-inquiry', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uni, email, person, pop })
  });
  // ...
}
```

### 3.2 Supabase Schema (proposed)

```sql
-- Universities
create table universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text,
  student_population int,
  partnership_tier text check (partnership_tier in ('lead','pilot','partner','strategic')),
  created_at timestamptz default now()
);

-- Verified Tenants (Dossiers)
create table dossiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  passport_url text,           -- Supabase Storage
  admission_url text,
  funds_url text,
  verified_at timestamptz default now(),
  badge_code text unique       -- public-facing RD-XXXXX
);

-- Rewards
create table referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid references auth.users,
  referred_user_id uuid references auth.users,
  credits_awarded int default 30
);

create table reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  reward_id text,
  credits_spent int,
  status text check (status in ('unlocked','shipped','reserved'))
);

-- WWSO Calculations (audit log)
create table wwso_calculations (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid references auth.users,
  inputs jsonb,
  total_points int,
  max_rent_eur numeric,
  pdf_url text,
  created_at timestamptz default now()
);

-- Activity Log (for compliance + analytics)
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  event text,
  payload jsonb,
  ip inet,
  created_at timestamptz default now()
);

-- Row Level Security
alter table dossiers enable row level security;
create policy "Users see own dossier" on dossiers
  for select using (auth.uid() = user_id);
```

### 3.3 Logging Strategy

Add a thin wrapper around every state-changing function:

```javascript
async function logEvent(event, payload) {
  // Optimistic — non-blocking
  navigator.sendBeacon('https://<project>.supabase.co/functions/v1/log',
    JSON.stringify({ event, payload, ts: Date.now() }));
}

// Usage:
// logEvent('dossier_submitted', { id: dossierId });
// logEvent('wwso_calculated', { points, maxRent });
// logEvent('b2b_inquiry', { uni });
```

### 3.4 File Structure (Antigravity's suggestion, ready to implement)

```
relonl/
├── index.html              # current single-file MVP
├── docs/
│   ├── README.md           # this file
│   ├── ARCHITECTURE.md     # deeper system design
│   ├── WWSO_SPEC.md        # 2025 WWSO reference values
│   ├── PARTNERS.md         # mgmco.nl + university outreach tracker
│   └── QA_AUDIT.md         # component-by-component pass/fail
├── assets/                 # (future) logos, hero images
└── .env.example            # (future) Supabase keys template
```

---

## 4. Known Issues & Tech Debt

| Priority | Issue | Mitigation |
|---|---|---|
| HIGH | No real auth → anyone can submit B2B form under fake university | Add Cloudflare Turnstile or hCaptcha before backend integration |
| HIGH | WWSO calculator is indicative, not legally binding | Add disclaimer + recommend official Huurcommissie tool link |
| MED | LocalStorage cap ~5MB → tracker data could overflow | Migrate to Supabase on user auth |
| MED | QR codes use placeholder relonl.example domain | Replace with real verification endpoint when deployed |
| LOW | No analytics → cannot measure funnel | Add Plausible or PostHog (privacy-friendly) |

---

## 5. Suggested Next Sprint

1. **Real backend integration** — Supabase + Google Auth (2-3 days)
2. **Email capture** — replace LocalStorage wizard with ConvertKit/Mailchimp
3. **Pilot with 1 university** — Eindhoven TU/e or Groningen RUG (white-label module)
4. **Content audit** — translate trust signals (kamernood, uitponden, Hospiteeravond) into short explainer videos
5. **Multi-language** — Spanish + Portuguese (LatAm international students are growing segment)

---

## 6. Pointers for Antigravity

- All `lsSet` / `lsGet` calls use namespace `relonl_` — search for these to find every persistence point
- All chart instances (radar, scatter, bar) destroy-then-recreate on input change to prevent canvas reuse errors
- The `cityData` object at the top of the `<script>` block is the single source of truth for per-city behavior — extend it instead of hardcoding elsewhere
- Custom modal (`showModal`/`closeModal`) replaces all `alert()` calls — keep using it
- The three affiliate placements (`https://mgmco.nl/jagohu`) are: BSN section, Essential Services card, Footer — all have `.partner-badge` styling

---

*Last updated: 2026-06-18. Generated alongside the production deploy.*