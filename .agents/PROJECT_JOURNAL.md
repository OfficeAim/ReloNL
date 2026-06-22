# ReloNL — PROJECT JOURNAL

## Session: 2026-06-18

### ✅ Completed
- Analyzed `index minimax.html` — decided it's the new production base (superior to original in all technical aspects)
- Reorganized project vault: all `.md` files moved to `docs/` structure
- Created `.agents/rules/project-constitution.md`
- Injected `ReloLogger`, `GoogleAuth` boilerplate, and Gems UI section into `index.html`
- Created `supabase/schema.sql` skeleton
- Created `supabase/functions/` skeletons (log-events, auth-google)
- Live URL (Production): https://relo2nl.netlify.app

### 🔑 Decisions Made
- **New base file:** `index minimax.html` copied to `index.html`
- **LocalStorage namespace:** `relonl_` (already in minimax)
- **Google Client ID:** placeholder `YOUR_GOOGLE_CLIENT_ID` — replace when ready
- **Supabase project:** placeholder URLs — create project before Phase 2

### 📍 Current State
- `index.html` = Minimax base + ReloLogger + GoogleAuth + Gems UI section
- All docs reorganized in vault
- Supabase schema ready to deploy

### 🎯 Next Priority (Phase 2)
1. Replace `YOUR_GOOGLE_CLIENT_ID` with real client ID
2. Implement Supabase edge function for log batching
3. Build Gems feature: Contract Analyzer (Gemini API)
4. Pilot outreach: TU Eindhoven international office

### ⚠️ Blockers
- None for Phase 1
- Phase 2 requires: Google Cloud Console project creation (Supabase project already created!)

---
### Session: 2026-06-18 (Part 2)

### ✅ Completed
- Initialized local Git repository
- Created `.gitignore`
- Committed Phase 1 files to local git (`ed3cb4a`)
- Created Supabase project (`relonl`, ref: `tavmoqvxvvcgzlobxhvw`) in `eu-west-1` via MCP
- Applied `schema.sql` migration to Supabase project
- **Deployed to Netlify!** Official Production URL: `https://relo2nl.netlify.app/`
<!-- Add new sessions below this line -->

### Session: 2026-06-22

### ✅ Completed
- Unificamos todos los links de documentación y código para que apunten a la URL oficial `relo2nl.netlify.app`.
- Desvinculamos el repositorio incorrecto y conectamos Netlify a `OfficeAim/ReloNL`.
- Añadimos las secciones "Scholarships & Financial Aid" (IEFA) y "Full Relocation & Buying" (Dutch Home Hunters) en `index.html`.
- Actualizamos el link de la municipalidad de Amsterdam al endpoint de "short-stay".
- Añadimos el SDK de Supabase al frontend (`index.html`).
- Inicializamos el cliente de Supabase con `tavmoqvxvvcgzlobxhvw.supabase.co` y la Anon Key provista.
- Refactorizamos la lógica del Onboarding Wizard (arreglando un bug crítico que bloqueaba el paso 4) e implementamos validación silenciosa: si el usuario tiene sesión activa en Supabase, el wizard auto-completa el email y finaliza.

### 🎯 Next Priority (Phase 1B)
1. Integrar Google Sign-In (GSI) y conectarlo con la Edge Function `auth-google` de Supabase.
2. Hacer el deploy de las Edge Functions (`log-events` y `auth-google`) a Supabase.
