# 📰 Sustain Insight – Frontend

This is the **frontend web application** for the **Sustain Insight** platform.
It provides a modern, dynamic, and personalized interface for sustainability-focused news aggregation.
Built with **React + TypeScript**, powered by **Vite**, and styled using **Tailwind CSS** for performance and scalability.

---

## ✨ System-Wide Features

### 🧠 Core Application

* Aggregated sustainability and climate-related articles from global sources
* Intuitive user interface with minimal design for high readability
* Integrated article filters by category, source, and publish date
* Dynamic pagination and lazy loading for performance

### 🔐 Authentication & Profiles

* Secure JWT-based login and signup (linked to backend auth)
* Password reset and email verification flow with modal-based UI
* Real-time validation for user input and API responses

### 📚 Articles & Insights

* Personalized **For You** feed powered by user preference data
* **All News** view for full catalog browsing
* **Bookmarks** section for saved articles
* Article modal view for quick reading without page navigation
* Clean typography and layout optimized for reading

### ⚡ User Experience (UI/UX)

* Unified responsive layout for mobile, tablet, and desktop
* Reusable components: `ArticleCard`, `FilterModal`, `ProfileModal`, `DashboardNav`, etc.
* Smooth transitions and animations powered by CSS & Framer Motion
* Built-in dark/light theme compatibility (future-ready)

### 🔗 Backend Integration

* Connected to the Sustain Insight Spring Boot backend via REST API
* Uses Axios for consistent network handling and error reporting
* All endpoints (Auth, Articles, Bookmarks, Insights) fully wired and type-safe

### 🧩 Utility & State Management

* Centralized authentication context (`AuthContext`)
* Custom hooks (`useArticles`, `useDashboardView`, `useAuthHandlers`)
* Modular folder structure for scalability and maintainability

---

## 🛠 Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Framework   | React 18 + TypeScript                 |
| Bundler     | Vite                                  |
| Styling     | Tailwind CSS + Custom Utility Classes |
| HTTP Client | REST API with Axios                                 |
| Routing     | React Router DOM                      |
| Animations  | Framer Motion                         |
| State       | React Hooks + Context API             |
| Deployment  | Vercel                                |

---

## ⚙️ Environment Setup

Run the following command depending on your platform, replacing `<VALUE>` with your backend API base URL:

### macOS / Linux (bash/zsh)

```bash
export VITE_BACKEND_URL=<your-backend-url>
```

### Windows (PowerShell)

```powershell
setx VITE_BACKEND_URL "<your-backend-url>"
```

Vite automatically injects this into your app during build and runtime.

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Nimsara-Jayarathna/Sustain-Insight---front-end.git
cd Sustain-Insight---front-end
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

This starts the app at **[http://localhost:5173](http://localhost:5173)**.

---

## 👥 Collaboration Workflow

* **Feature branches** – use meaningful names:

  * `feature/feed-page`
  * `feature/login-page`
  * `feature/password-reset`
* **Development branch (`dev`)**

  * All merges happen here via PRs.
  * PRs require review and CI pass.
* **Main branch (`main`)**

  * Production-ready.
  * Merges from `dev` after verification.

**Branch Protection Rules:**

* PR required for all merges
* No direct commits or force pushes
* All checks must pass

---

## 📂 Project Structure

```
src/
├── assets/          # Static assets and icons
├── components/      # Reusable UI components
│   ├── auth/        # Auth modal & forms
│   ├── dashboard/   # Dashboard views
│   └── layout/      # Header, Footer, Navigation
├── context/         # Global context (Auth, DashboardView)
├── hooks/           # Reusable custom hooks
├── pages/           # Main route pages (Landing, Dashboard)
├── utils/           # Helper functions (api.ts, storage.ts)
└── main.tsx         # App entry point
```

---

## 🔒 Security Notes

* `.env` is ignored in Git and must not be committed.
* Only `.env.example` is included to show required variables.
* All requests go through HTTPS in production.
* Backend JWT and API keys are securely handled.

---

## 🧭 Deployment

* Deployed automatically via **Vercel** upon merging into `main`.
* Uses environment variable `VITE_BACKEND_URL` in Vercel dashboard.
* Integrated with backend deployments on **Railway** or **Render**.

---

## 🦯 License

This project is maintained by the **Sustain Insight Team**.
© 2025 Sustain Insight. All rights reserved.
