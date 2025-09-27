# 📰 Sustain Insight – Frontend

This is the **frontend web application** for the News Aggregator project.
It is built with **React + TypeScript** using **Vite** for fast builds and **Tailwind CSS** for styling.

---

## ✨ Features

* Modern, responsive UI for browsing news articles
* Pages for All News, Saved Articles, and Preferences
* Login & Signup integrated with backend authentication (JWT)
* Reusable components (ArticleCard, FilterBar, Navbar, Modals)
* Fully connected to REST API from the backend

---

## 🛠 Tech Stack

* React + TypeScript (Vite)
* Tailwind CSS
* Axios (API requests)

---

## ⚙️ Environment Setup

Run the following command depending on your platform, replacing placeholders (`<VALUE>`) with your actual API endpoint and keys:

### macOS / Linux (bash/zsh)

```bash
export VITE_API_BASE_URL=<your-backend-url>
```

### Windows (PowerShell)

```powershell
setx VITE_API_BASE_URL "<your-backend-url>"
```

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

This will start the frontend on [http://localhost:5173](http://localhost:5173)

---

## 👥 Collaboration Workflow

* **Feature branches:**
  Use dedicated branches like:

  * `feature/feed-page`
  * `feature/login-page`
  * `feature/saved-page`
  * `fix/navbar-bug`

* **Development branch (`dev`):**

  * All features are merged into `dev` first.
  * Requires review and passing checks.

* **Main branch (`main`):**

  * Production-ready branch, directly used for deployment (Vercel).
  * PRs from `dev` are squashed and merged into `main`.

* **Branch protections:**

  * PRs required for merges.
  * No direct commits or force pushes to `main` or `dev`.
  * Status checks and reviews required.

---

## 🔒 Security Notes

* `.env` is ignored in Git — never commit secrets.
* Only `.env.example` is tracked to show required variables.
* API base URL and other environment-specific configs must be provided locally or in deployment settings.
