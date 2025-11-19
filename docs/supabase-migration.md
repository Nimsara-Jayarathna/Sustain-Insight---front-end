# Sustainable Insight Frontend – Supabase Migration Guide

This guide documents the steps required to migrate an existing Sustainable Insight frontend that depended on the Spring Boot API to the new fully serverless architecture powered by Supabase.

## 1. Environment Variables

Create a `.env` file based on `.env.example` and supply the Supabase project credentials:

```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

Remove any legacy `VITE_BACKEND_URL` references. Vite now talks directly to Supabase.

## 2. Supabase Client

- `src/lib/supabaseClient.ts` centralises `createClient` with token persistence and URL detection enabled.
- All modules import this singleton, so no additional configuration is required per hook/component.

## 3. Zustand Stores

- `src/stores/authStore.ts` bootstraps Supabase auth, exposes email + OAuth login helpers, password reset, and session expirations.
- `src/stores/filterStore.ts` keeps article filters/pagination in sync across the dashboard.

Consumers access these stores through the new hooks:

```ts
const { loginWithGoogle, logout, session } = useAuth();
const { search, setSearch } = useArticleFilters();
```

## 4. Services

- `src/services/supabaseArticles.ts` encapsulates all `articles`, `categories`, `saved_articles`, and `article_insights` queries.
- `src/services/supabaseUser.ts` handles `user_profiles`, preferences, and source/category metadata.

These helpers return TypeScript-friendly models and keep RLS-compliant filters (`user_id`, `eq`, `range`, etc.) in one place.

## 5. Hooks

| Hook                 | Responsibility |
|----------------------|----------------|
| `useArticles`        | Sorting, search, filtering, pagination via Supabase range queries |
| `useSavedArticles`   | Paginated bookmarked articles for the dashboard |
| `useCategories` | Lightweight metadata fetcher |
| `useUserProfile`     | Profile + preference tabs (reads & writes Supabase tables) |
| `useAuthHandlers`    | Email/password auth helpers backed by Supabase Auth |

All previous `apiFetch` usages have been replaced by these hooks.

## 6. UI Changes

- Login form now includes `LoginButton` components for Google, Facebook, and LinkedIn.
- AllNews/ForYou/Bookmarks views consume `useArticles` / `useSavedArticles` data instead of hitting `/api/*` endpoints.
- Profile modal uses Supabase for change-email, change-password, and active session details.

## 7. Removing the Legacy Backend

- The entire `src/api/` directory and `src/utils/api.ts` were deleted.
- `vite.config.ts` no longer proxies `/api`.
- Any README references to the Spring Boot backend were replaced with Supabase instructions.

## 8. Storage + Images

`getPublicImageUrl` (in `supabaseArticles.ts`) generates signed/public URLs from the `articles` storage bucket, keeping the article cards and modals backwards compatible with existing `image_path` values.

## 9. Saved Articles & Preferences

- `saveArticle`, `removeSavedArticle`, and `getSavedArticles` wrap the `saved_articles` table and are used by article cards + bookmark view.
- `user_preferences` persists category/source selections and is consumed by `useUserProfile` + `ForYouView` for personalised feeds.

## 10. Testing the Migration

1. Update `.env` with Supabase keys.
2. Run `npm install` to pull `@supabase/supabase-js` and `zustand`.
3. `npm run dev` â€“ login (OAuth or email) should redirect straight to `/dashboard` using Supabase sessions.
4. Exercise articles, filters, bookmarks, and profile tabs to validate Supabase RLS policies.

Once these steps pass, the frontend is fully detached from the Spring Boot backend and can be deployed as-is.
