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
| State            | Zustand stores + domain hooks (`useArticles`, etc.) |
| Backend-as-a-Service | Supabase (Auth, Postgres, Storage)            |
| Deployment       | Azure Static Web Apps (SPA build in `dist/`)     |

Deployment to **Azure Static Web Apps** is handled by the CI pipeline:

1. A production build is created with `npm run build` (output in `dist/`).
2. The GitHub action pushes assets to Azure; PRs against `main` trigger preview environments automatically.

---

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+
- A Supabase project configured with the `articles`, `categories`, `saved_articles`, `article_insights`, `user_profiles`, and `user_preferences` tables plus OAuth providers (Google, Facebook, LinkedIn).

Create a `.env` file by copying `.env.example` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
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
├── components/      # UI building blocks (auth, dashboard, layout, etc.)
├── context/         # ThemeProvider and shared UI contexts
├── hooks/           # Reusable Supabase + state hooks (auth, articles, saved items)
├── lib/             # Supabase client factory
├── pages/           # Route-level components (Landing, Dashboard)
├── services/        # Supabase query helpers (articles, user profile)
├── stores/          # Zustand stores (auth, filters)
├── types/           # Shared TypeScript models
├── App.tsx          # Router + route guards
└── main.tsx         # Client bootstrap with providers
```

Tailwind configuration lives in `tailwind.config.ts`, and class scanning is driven through `src/index.css` with `@config`.

---

## Feature Deep Dive

### Authentication & Session Flow
- Supabase handles OAuth (Google, Facebook, LinkedIn), email signup, and password recovery through the hosted auth service.
- Zustand's `authStore` bootstraps the session via `supabase.auth.getSession()` and listens for `onAuthStateChange` events to keep React in sync.
- `useAuth` exposes helpers (`loginWithGoogle`, `loginWithPassword`, `logout`, etc.) so components never talk to Supabase directly.

### News & Insights
- Feeds use incremental loading with server-side pagination meta (`totalPages`).
- Filtering UI batches category and source selection, with pill-based active filter chips.
- All network errors are surfaced in-component (no raw console logs) and fall back to empty states where appropriate.

### Profile Management
- Single modal with tabbed navigation (Profile, Preferences, Security).
- Change-email flow re-authenticates the user and leverages Supabase's email confirmation link.
- Security tab exposes password updates and a Supabase-backed "Active Session" card with one-click global sign-out.

### Dark Mode
- Root `<html>` toggles `.dark`; Tailwind `dark:` variants drive component styles.
- Overlay, loading, and snackbar components re-use the gradient spinner for brand cohesion.
- Theme preference persists across reloads and respects `prefers-color-scheme` by default.

---

## Developer Tips

- Prefer Tailwind utilities; reserve custom CSS for shared animations or base layers in `src/index.css`.
- When storing new data, add a helper in `src/services/` that composes Supabase queries, then expose it through a hook or Zustand store.
- Keep theme variants in sync by using existing design tokens: emerald→cyan gradients, slate neutrals, and `dark:` pairings.
- To validate auth/session flows quickly, open the profile modal’s Security tab and trigger logouts from additional devices.

---

## Support & Contact

The Azure Static Web Apps production deployment tracks the `azure-deploy` branch. Preview environments are built from pull requests before merging.

Need help, found a bug, or want to propose a feature? Email **contact.sustain-insight@blipzo.xyz** and the frontend/deployment crew will respond.

---

© 2025 Sustain Insight. All rights reserved.
