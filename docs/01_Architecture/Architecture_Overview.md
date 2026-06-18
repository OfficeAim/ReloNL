# ReloNL Platform Architecture

The ReloNL platform is designed as a **production-ready, single-file application**. This architectural choice ensures maximum portability, zero-configuration deployment (Netlify Drop), and high performance for students accessing the portal from diverse global locations.

## 🏗️ Technical Stack

ReloNL utilizes a modern, dependency-light stack to ensure stability and ease of maintenance:

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5 / Tailwind CSS (CDN) | Responsive, mobile-first UI with a premium aesthetic. |
| **Logic** | Vanilla JavaScript (ES6+) | All interactive features, wizards, and calculations. |
| **Visualization** | Chart.js (CDN) | Radar charts for WWSO and scatter plots for market tracking. |
| **Persistence** | LocalStorage | Simulating a database for user dossiers, credits, and tracking. |
| **APIs** | QR Server API | Real-time generation of SEPA and Verification QR codes. |

## 🎨 Design System & UX

The platform adopts a **trust-centric design** to differentiate itself from competitors who failed due to unethical practices.

- **Primary Colors:** `#0066CC` (Trust Blue) and `#10B981` (Verified Green).
- **UI Elements:** `rounded-2xl` containers, subtle shadows, and smooth transitions.
- **Visual Language:** Extensive use of emojis as icons to maintain a modern, student-friendly feel.
- **Language Policy:** All user-facing content is in **English**, while maintaining official Dutch terminology (e.g., *BRP, WWSO, Uitponden*) to educate the user.

## 💾 Data Management Strategy

Since ReloNL operates with **zero backend**, all data is handled client-side:
1. **Onboarding Data:** Stored in LocalStorage to adapt content dynamically.
2. **Solvency Dossier:** Uploaded files are handled as local references or simulated via the "Verified Tenant Badge" logic.
3. **Token System:** Credits and referral counts are persisted across sessions in the user's browser.
