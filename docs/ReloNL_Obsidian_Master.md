---
aliases: [ReloNL Master, Relocate2NL]
tags:
  - project/startup
  - tech/saas
  - status/phase1-complete
created: 2026-06-18
updated: 2026-06-18
---

# 🚀 ReloNL — Project Master Note

**ReloNL** es una plataforma tecnológica (*prop-tech*) orientada a solucionar la crisis de vivienda para estudiantes internacionales en Países Bajos (kamernood). El enfoque es un modelo B2B donde el estudiante no paga tarifas de intermediación.

🔗 **Live Production URL:** [relo2nl.netlify.app](https://relo2nl.netlify.app/)
🔗 **Github Repo:** Localizado en `/Movies/OFICEAIM/Relonl`

---

## 🏗️ Arquitectura del Sistema

El proyecto usa un enfoque *Static-First* para validar el mercado rápidamente, conectado a un backend Serverless.

- **Frontend:** Single-file monolith (`index.html`), 97KB.
- **Styling:** Tailwind CSS (CDN) + Brand Colors personalizados (Deep Trust Blue `#00478F` & Dutch Orange `#FF8C00`).
- **Lógica B2C:** Vanilla JavaScript (ES6+) con `localStorage` (namespace: `relonl_`).
- **Backend (Phase 2):** [[Supabase]] (PostgreSQL) + Edge Functions (Deno).
- **IA (Phase 2):** [[Google Gemini]] API (Gems System).
- **Hosting:** [[Netlify]] (Auto-deploy desde GitHub).

---

## 📚 Vault Structure (Documentación)

Toda la documentación técnica y estratégica está organizada en el repositorio bajo la carpeta `docs/`:
- `01_Architecture/` — Visión técnica.
- `02_Strategic_Pillars/` — Estrategia, OfficeAIM Gems, Partners (mgmco.nl).
- `03_Procedures_Workflows/` — Lógica de cálculo WWSO, solución BSN.
- `04_Student_Guides/` — Guías para el usuario final.
- `05_Deployment/` — QA Audit, Maintenance.

> [!info] AI Agent Workflow
> Los agentes de IA (como Antigravity) usan la carpeta `.agents/` para mantener el contexto. Las skills automatizadas (`/lognow`, `/savetoday`) guardan el estado en `PROJECT_JOURNAL.md` y en la memoria persistente (Engram).

---

## ✅ Fase 1 Completada (MVP B2C)

1. **Reorganización del Vault:** Migración de `index minimax.html` como base de producción.
2. **Git & CI/CD:** Inicialización del repo, `.gitignore` y primer commit desplegado exitosamente en Netlify.
3. **Identidad Visual:** Logo incorporado y paleta de Tailwind configurada en el frontend.
4. **Infraestructura de Datos:**
   - Creado proyecto en Supabase (Región: `eu-west-1`).
   - `schema.sql` migrado (Tablas: `client_logs`, `gem_accounts`, `gem_transactions`, `b2b_inquiries`, `landlord_listings`).
5. **Tracking:** `ReloLogger` inyectado en 17 puntos clave del *funnel*.

---

## 🎯 Próximos Pasos (Fase 2)

La Fase 2 "despierta" el backend y conecta la IA. 

- [ ] Conseguir el **Google Client ID** desde Google Cloud Console.
- [ ] Inyectar el Client ID en el frontend para habilitar *Google Sign-In*.
- [ ] Desplegar las Edge Functions de Supabase (`log-events` y `auth-google`).
- [ ] Construir la función proxy `ai-gemini` para conectar los features de IA (Contract Analyzer, Legal Coach) cobrando el balance de "Gemas" del usuario.

---

**NOTA DE CONTINUACIÓN — ReloNL Google Auth**

Paramos aquí hoy. El Google Sign-In está implementado en index.html 
pero AÚN NO se ha probado ni desplegado.

PRÓXIMA SESIÓN — hacer en este orden:

1. PROBAR en localhost:8080:
   - Verificar que aparece el botón "Continue with Google" en el hero
   - Hacer clic y confirmar que redirige a Google
   - Confirmar que al volver aparece la session bar con foto y email
   - Confirmar que el autoscroll al wizard funciona
   - Confirmar que Sign Out funciona

2. Si todo funciona → /lognow y deploy a Netlify

3. PROBLEMA PENDIENTE — cuenta Supabase equivocada:
   El proyecto Supabase que se está usando es de LinguaEnLinea 
   (tavmoqvxvvcgzlobxhvw) pero debería estar bajo la cuenta 
   de ReloNL (rodyf81@gmail.com). 
   Hay que evaluar si crear un proyecto Supabase nuevo exclusivo 
   para ReloNL o si dejarlo así por ahora.

4. DESPUÉS del auth funcionando → Fase 2: mejorar el frontend 
   (visual upgrade del hero, cards, animaciones)

---
*Relacionados:* [[Supabase Setup]], [[Gemini AI Integration]], [[WWSO Calculator]]
