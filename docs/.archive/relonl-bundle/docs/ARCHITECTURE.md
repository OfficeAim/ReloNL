# ReloNL — Architecture Decisions

## Why Static-First?

### Decision: Ship the marketing portal as a single `index.html` first.

**Rationale:**
1. **Speed to validate.** The platform's value hypothesis is that international students need a *trustworthy* alternative to scam-heavy listings sites. We can validate that with a static portal + LocalStorage before burning 6 months on auth/backend.
2. **B2B sales tool.** Universities and property managers need to see a live demo to take us seriously. A clickable URL beats a Figma file.
3. **Zero ops overhead.** No DB to provision, no auth to debug, no rate limits to defend. Anyone with the link can use it.

**Trade-offs accepted:**
- No real user accounts (anyone can clear LocalStorage and start over)
- No cross-device persistence
- No anti-spam on B2B form
- WWSO PDF exports stay in the user's browser (we never see them)

These are acceptable for the **pilot phase** (1 university, 1 city). They become blockers at **commercial scale** (>100 MAU).

---

## Layer Map

```
┌────────────────────────────────────────────────────┐
│  Layer 4: B2B Sales Funnel (future)                │
│  - University partnership dashboard                │
│  - Landlord onboarding wizard                      │
│  - Commission invoicing                             │
└────────────────────────────────────────────────────┘
                       ▲
┌────────────────────────────────────────────────────┐
│  Layer 3: Backend Services (future — Supabase)     │
│  - Auth (Google OAuth)                              │
│  - Postgres tables: dossiers, rewards, wwso        │
│  - Storage: passport PDFs, WWSO PDFs                │
│  - Edge Functions: logEvent, b2b-inquiry            │
└────────────────────────────────────────────────────┘
                       ▲
┌────────────────────────────────────────────────────┐
│  Layer 2: Static Portal (current — this build)     │
│  - index.html (all UI + heuristic logic)           │
│  - LocalStorage (simulated DB)                      │
│  - QR Server API (verification badges)              │
│  - jsPDF (WWSO report download)                     │
└────────────────────────────────────────────────────┘
                       ▲
┌────────────────────────────────────────────────────┐
│  Layer 1: CDN (Netlify / Minimax Space)             │
│  - HTTPS + global caching                           │
│  - Custom domain when needed                        │
└────────────────────────────────────────────────────┘
```

---

## Module Boundaries

### Frontend (this `index.html`)
- Owns: all UX, all form validation, all heuristic logic, all visualizations
- Delegates: nothing yet (no backend)
- Acceptable to break out later: chart components, AI tool handlers

### Backend (when added)
- Owns: user identity, persisted state, audit logs, file storage
- Pattern: thin REST/Edge Functions; frontend calls them; no business logic in DB triggers
- Auth: Google OAuth only (no passwords — international students bounce off password complexity)

### Third-party Services
| Service | Purpose | When to add |
|---|---|---|
| Supabase | DB + Auth + Storage | Day 1 of pilot |
| ConvertKit | Email capture | Day 1 of pilot |
| Cloudflare Turnstile | Bot protection | Day 1 of pilot |
| Plausible | Privacy-friendly analytics | When validating funnel |
| Sentry | Error tracking | When adding backend |

---

## State Management

### Current (LocalStorage)
```javascript
const NS = 'relonl_';
function lsGet(k, def) { ... }
function lsSet(k, v) { ... }
```

### Future (replace with TanStack Query → Supabase)
```javascript
// Current
lsSet('rewards', { credits: 250, friends: 5, redeemed: ['ft'] });

// Target
const { data } = useQuery(['rewards', user.id], () =>
  supabase.from('rewards').select('*').eq('user_id', user.id).single()
);
```

---

## Deployment Strategy

### Phase 1 (now)
- Single `index.html` → drag-drop to Netlify Drop or `space.minimax.io`
- Manual updates: edit → re-upload

### Phase 2 (pilot)
- Git repo (GitHub) → Netlify auto-deploy on push
- Preview URLs per PR
- Custom domain (relonl.nl)

### Phase 3 (scale)
- Migrate to Next.js or Astro (keep single-file pages, add backend)
- Edge Functions for low-latency WWSO calc
- CDN cache busting via hashed asset names

---

## Security Posture (current)

| Risk | Current | Target |
|---|---|---|
| B2B form spam | None | Cloudflare Turnstile |
| Dossier forgery | LocalStorage only (not verifiable) | Server-side UUID + signed payload |
| WWSO PDF manipulation | User-controlled | Server-generated, watermarked |
| Affiliate link hijacking | Plain `<a>` tag | Add `rel="sponsored"` + UTM |

---

## Performance Budget

- **First Contentful Paint:** <1.5s on 4G
- **Time to Interactive:** <3s
- **JS bundle:** currently 0 KB (vanilla); future max 80 KB gzipped
- **Lighthouse score target:** >90 all categories

Current Tailwind CDN (~300 KB) is the biggest weight — acceptable for MVP, will be replaced with compiled CSS in Phase 2.