# Horizon

**Horizon — Personal Banking Simulator**

> ✨ A delightful, feature-rich banking simulator that makes tracking and exploring your finances feel effortless — smooth animations, a friendly UI, and satisfying micro-interactions.

---

## 🌟 About

Horizon is a compact banking app built to be both useful and enjoyable. Create and manage banks (cards), add transactions, organize spending with categories and budgets, and discover insights with clear charts and histories. The app aims to make finance tracking feel **reassuring**, **intuitive**, and even a little **fun**. 🎉

---

## ✅ Core features

* 💳 Create / edit / delete banks (cards)
* 🔁 Add transactions (deposits, withdrawals, transfers)
* 🏷️ Create & manage categories and per-category budgets
* 💰 Track balances, monthly budgets and transaction history with statuses (PROCESSING, SUCCESS, DECLINED)
* 📊 Expense visualizations and charts that make trends obvious at a glance
* ✨ Smooth animations and polished transitions (Framer Motion) — delightful micro-interactions throughout
* 🔐 JWT-based authentication using **next-auth (v5)** — secure and robust

---

## 🛠️ Tech stack (main technologies)

This project blends solid engineering with joyful UX — here are the main technologies that power Horizon:

**React 19 + TypeScript** — the UI layer: reliable, type-safe, and expressive (so you can build confidently). ❤️

**Next.js (App Router)** — modern routing and server/client boundaries that keep the app fast and scalable. 🚀

**Tailwind CSS** — utility-first styling for consistent, responsive design without headaches. 🎨

**Prisma** — clear, schema-first ORM for local development and migrations (easy to reason about your data). 🗂️

**NextAuth (v5) — JWT strategy** — stateless authentication and session handling with solid security primitives. 🔐

**React Hook Form + Zod** — clean, fast forms with type-safe validation (no more fragile form logic). 🧩

**@reduxjs/toolkit + redux-persist** — predictable global state with persistence for a smooth UX when users return. 🧠

**@tanstack/react-query** — background sync & caching so your UI feels instant and consistent. ⚡

**Framer Motion** — animations that make interactions feel alive and satisfying. ✨

**Chart.js + react-chartjs-2** — beautiful charts that turn numbers into insight. 📈

**(included) react-router** — noted per request (Next.js handles routing by default). 🔁

### Other notable libraries

A few helpful additions that polish the experience:

* **axios** — for reliable API calls
* **bcryptjs / jose** — hashing and token tools for secure flows
* **date-fns** — date helpers for crisp formatting
* **uuid** — unique IDs when you need them
* **rc-slider / react-range** — sliders and range inputs for fine control
* **react-colorful / tinycolor2 / chroma-js / randomcolor** — color tools for playful category palettes
* **tippy.js / @tippyjs/react** — friendly tooltips
* **immer / use-immer** — simpler immutable updates
* **zod** — runtime schema validation used in forms

---

## 📂 Project structure (expanded)

```
src/
├─ app/                   # Next.js App Router pages, layouts, and route handlers (main entry points)
│  ├─ layout.tsx
│  └─ (routes...)
├─ components/            # Reusable UI components (Dropdowns, Forms, Cards, Modals) — small, focused, and testable
├─ hooks/                 # Custom hooks (useBank, useTransactions, useAuth) — encapsulate logic and keep components clean
├─ services/              # Business logic services (connectBankService, api clients) — single responsibility
├─ state/                 # Redux slices, store configuration, persistence (redux-persist)
├─ prisma/                # Prisma schema and migrations — data model lives here
├─ styles/                # Tailwind config and global styles (scss partials if any)
├─ types/                 # TypeScript shared types and interfaces
├─ utils/                 # Utility helpers (formatting, validators)
├─ public/                # Static assets (images, demo GIFs)
├─ tests/                 # Unit / integration tests (if present)
└─ src/app/api/           # API route handlers (server-side logic)
```

Each folder is intentionally focused to keep the codebase readable, maintainable, and friendly to contributors. 🧰

---

## ⚠️ NOTE — Middleware & Deployment (important)

**Middleware is intentionally disabled in the repository for deployment on Vercel.**

Why: Vercel’s edge/middleware behavior caused unexpected differences in how authentication and route guards ran in production. To avoid a broken demo on the hosted site, middleware was disabled so the app behaves predictably when deployed to Vercel. It was a pragmatic choice — painful to change, but safer for a public demo. 😅

**Good news:** middleware works perfectly in a local dev environment — you can re-enable it locally to test route guards and edge behavior.

### Re-enable middleware locally (quick checklist)

1. **Restore the middleware file**

   * Typical paths:

     * `src/middleware.ts`
     * or `src/app/middleware.ts`
   * If you previously renamed, commented out, or removed it, restore the original file from your working branch or undo the change.

2. **Set environment variables**

   * Ensure `.env` includes:

     ```
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="your_long_random_secret"
     DATABASE_URL="file:./dev.db"   # or your DB URL
     ```

3. **Run the app locally**

   * `npm install` (or `pnpm install` / `yarn`)
   * `npm run dev`  (dev server runs middleware in local environment)

4. **Verify NextAuth & JWT configuration**

   * Check your NextAuth options (providers & session strategy) and ensure JWT is configured properly.
   * Confirm any jose/jwt key material is present if you use custom signing.

5. **Troubleshooting tips**

   * If middleware behaves differently in production, consider:

     * Converting middleware logic to server-side guards inside `/src/app` route handlers where possible.
     * Using a Node-based host instead of Vercel edge functions if you need full middleware behavior in production.
     * Adding a `vercel.json` to configure functions/edge runtime if you have a Vercel plan that supports custom setups.
