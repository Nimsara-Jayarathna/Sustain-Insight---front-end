# Sustain Insight Frontend

Sustain Insight delivers an executive-ready sustainability briefing every day.  
This repository contains the React + TypeScript single-page application that powers both the marketing experience and the authenticated dashboard.

---

## Table of Contents

1. [Key Experiences](#key-experiences)  
2. [Technology Overview](#technology-overview)  
3. [Prerequisites](#prerequisites)  
4. [Quick Start](#quick-start)  
5. [Project Layout](#project-layout)  
6. [Feature Deep Dive](#feature-deep-dive)  
7. [Quality Gates](#quality-gates)  
8. [Developer Tips](#developer-tips)  
9. [Support](#support)

---

## Key Experiences

### Landing and Storytelling
- Responsive hero + feature sections tuned for marketing pages.
- Animated article rotator with gradient framing and CTA prompts.
- Real contact details, footer navigation, and accessible focus states.

### Auth Journey
- Login, sign-up, forgot password, and reset password share a unified modal flow.
- Context-driven state management handles silent refresh, session expiry, and global logout.
- Profile modal supports change-email, change-password, and preference management without full-page reloads.

### Dashboard Intelligence
- Personalised **For You** feed with pagination and graceful fallback states.
- **All News** index with keyword search, sort, and multi-select filter modal.
- **Bookmarks** view with empty-state prompts and quick navigation actions.
- Article modal supports prefetching, bookmark/insight toggles, and dark-mode friendly typography.

### Dark and Light Themes
- Class-based theming via a custom `ThemeProvider` persisted to localStorage.
- Tailwind CSS v4 class scanning ensures both palettes stay in sync.
- Gradient spinner, overlays, and utility components reflect the brand palette.

---

## Technology Overview

| Layer            | Stack / Tooling                                  |
|------------------|--------------------------------------------------|
| Framework        | React 19 + TypeScript                            |
| Build            | Vite 7 (ESBuild + Rollup pipeline)               |
| Styling          | Tailwind CSS v4 with class-based dark mode       |
| Routing          | React Router DOM v7                              |
| State            | Hooks + custom `AuthContext` and `ThemeContext`  |
| HTTP             | Native `fetch` wrapped by `apiFetch`             |
| Deployment       | Azure Static Web Apps (SPA build in `dist/`)     |

Deployment to **Azure Static Web Apps** is handled by the CI pipeline:

1. A production build is created with `npm run build` (output in `dist/`).
2. The GitHub action pushes assets to Azure; PRs against `main` trigger preview environments automatically.

---

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+
- Access to the Sustain Insight backend (Spring Boot) with refresh-token cookies enabled

Set the backend URL before running the client:

```bash
# macOS / Linux
export VITE_BACKEND_URL=https://your-backend.tld

# Windows PowerShell
setx VITE_BACKEND_URL "https://your-backend.tld"
```

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Nimsara-Jayarathna/Sustain-Insight---front-end.git
cd Sustain-Insight---front-end

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev

# 4. Build a production bundle
npm run build

# 5. Preview the production bundle locally
npm run preview
```

Vite serves the application at `http://localhost:5173` during development.

---

## Project Layout

```
src/
├── api/             # REST endpoint wrappers (auth, sessions, user)
├── components/      # UI building blocks (auth, dashboard, layout, etc.)
├── context/         # AuthProvider, ThemeProvider, bridge helpers
├── hooks/           # Reusable data-fetching and state hooks
├── pages/           # Route-level components (Landing, Dashboard)
├── utils/           # apiFetch, error extraction, date helpers
├── App.tsx          # Router + route guards
└── main.tsx         # Client bootstrap with providers
```

Tailwind configuration lives in `tailwind.config.ts`, and class scanning is driven through `src/index.css` with `@config`.

---

## Feature Deep Dive

### Authentication & Session Flow
- Access tokens are stored in-memory and added to requests via `apiFetch`.
- Silent refresh runs on app load; if the refresh cookie is missing the session-expired overlay is triggered without console noise.
- Logout clears tokens client-side even if the backend request fails.

### News & Insights
- Feeds use incremental loading with server-side pagination meta (`totalPages`).
- Filtering UI batches category and source selection, with pill-based active filter chips.
- All network errors are surfaced in-component (no raw console logs) and fall back to empty states where appropriate.

### Profile Management
- Single modal with tabbed navigation (Profile, Preferences, Security).
- Change-email flow uses staged OTP verification for current and new emails.
- Active Sessions panel lists all devices, supports per-device and global logout, and adapts styling for both themes.

### Dark Mode
- Root `<html>` toggles `.dark`; Tailwind `dark:` variants drive component styles.
- Overlay, loading, and snackbar components re-use the gradient spinner for brand cohesion.
- Theme preference persists across reloads and respects `prefers-color-scheme` by default.

---

## Developer Tips

- Prefer Tailwind utilities; reserve custom CSS for shared animations or base layers in `src/index.css`.
- When wiring new REST calls, create a helper in `src/api/` and consume it via hooks—`apiFetch` already handles credentials and automatic refresh.
- Keep theme variants in sync by using existing design tokens: emerald→cyan gradients, slate neutrals, and `dark:` pairings.
- To validate auth/session flows quickly, open the profile modal’s Security tab and trigger logouts from additional devices.

---

## Support & Contact

The Azure Static Web Apps production deployment tracks the `azure-deploy` branch. Preview environments are built from pull requests before merging.

Need help, found a bug, or want to propose a feature? Email **contact.sustain-insight@blipzo.xyz** and the frontend/deployment crew will respond.

---

© 2025 Sustain Insight. All rights reserved.
