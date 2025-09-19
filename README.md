# 📰 Sustain Insight – Frontend

This is the **frontend web application** for the News Aggregator assignment project.  
It is built with **React + TypeScript** using **Vite** for fast builds and **Tailwind CSS** for styling.

---

## ✨ Features
- Modern, responsive UI for browsing news articles
- Pages for All News, Saved Articles, and Preferences
- Login page (UI ready; API integration planned)
- Reusable components (ArticleCard, FilterBar, Navbar)
- Integrated with REST API from the backend

---

## 🛠 Tech Stack
- React + TypeScript (Vite)
- Tailwind CSS

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Nimsara-Jayarathna/Sustain-Insight---front-end.git
```
```bash
cd Sustain-Insight---front-end
```
### 2. Install dependencies
```bash
npm install
```
### 3. Install Tailwind (already configured)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Start the development server
```bash
npm run dev
```

This will start the frontend on http://localhost:5173

## 🌐 API Configuration
The frontend expects a backend running at http://localhost:8080 by default.
You can override this by setting the environment variable in a .env file:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## 👥 Collaboration Workflow

- **Work on feature branches:**  
  Each team member should create their own branch for a feature or fix.  
  Example branch names:
  - `feat/feed-page`
  - `feat/login-page`
  - `feat/saved-page`
  - `fix/navbar-bug`

- **Open Pull Requests (PRs) to `main`:**  
  - Once your work is ready, push your branch and open a PR.  
  - Request at least one review from a teammate.  
  - Merge only after approval and (if set up) passing CI checks.

- **`main` is protected:**  
  - Direct pushes to `main` are disabled.  
  - All changes must go through the PR + review process.  
  - Keeps `main` always in a working state for demos.
