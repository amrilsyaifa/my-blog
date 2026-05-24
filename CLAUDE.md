# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start development server on http://localhost:3000
pnpm build      # production build
pnpm lint       # ESLint via next lint
```

Package manager is **pnpm** (enforced via `.npmrc`). There are no tests configured.

## Architecture

This is a personal portfolio/blog built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Firebase Firestore** as the backend data source.

### Routing

All routes live under `src/app/[locale]/` — every page is wrapped in the locale segment for i18n. Supported locales are `en` and `id`, configured in `src/constants/locale.ts` and `src/middleware.ts`. The middleware redirects `/` to the default locale (`en`).

### Pages → Views pattern

Pages in `src/app/[locale]/` are thin wrappers that just render a corresponding view component. Business logic (Firestore fetching, state, tabs) lives in `src/views/<section>/`. For example:

- `src/app/[locale]/blog/page.tsx` renders `src/views/blog/BlogView.tsx`
- `src/app/[locale]/project/[id]/page.tsx` renders `src/views/project-detail/ProjectDetailView.tsx`

### Data layer

All data comes from **Firebase Firestore** — there is no API layer. Views fetch directly from collections:
- `blogs` — blog posts (filtered client-side by `lang` field: `"en"` | `"id"`)
- `projects` — portfolio projects (filtered by `project_by`: `"self"` | `"company"`)
- `project_detail` — project detail documents keyed by project `id`

Firebase is initialized in `src/configs/firebase.ts` using `NEXT_PUBLIC_FIREBASE_*` env vars (see `.env.example`).

### Path alias

`@components/*` resolves to `src/*` (configured in `tsconfig.json`). Use this alias for all internal imports.

### i18n

Translation strings live in `messages/en.json` and `messages/id.json`. Use `useTranslations(namespace)` from `next-intl` in client components and `getTranslations` in server components.

### Theming

Dark/light mode via `next-themes` with the `class` strategy. The accent color in dark mode is `#ec7a56`. Theme toggle is in `src/components/ThemeSwitch.tsx`.

### Images

Remote images are served from **Cloudinary** (`res.cloudinary.com`), whitelisted in `next.config.mjs`.
