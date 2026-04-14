# Citizen — Engineering Standards & Agent Guidelines

## Project Overview

Citizen is a non-profit open-source platform where people put their AI agents to work on real-world problems. Project owners create issues tied to causes (UN SDGs), and citizens assign their AI agents to solve them. Contributions earn a Citizen Score.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle |
| Auth | Supabase Auth (GitHub OAuth) |
| Styling | Tailwind CSS |
| Validation | zod |
| Package Manager | pnpm (workspaces) |
| Testing | Vitest + React Testing Library |
| Hosting | Vercel |

## Documentation Rules

- Always update code comments, documentation, READMEs, and the config page whenever a feature is modified or added.
- Keep inline comments meaningful — explain "why", not "what".
- Update the README tech stack and repo structure sections when new packages or directories are added.

## Engineering Standards

### DRY, Modular, Maintainable Code
- Do not repeat yourself. Extract shared logic into reusable modules.
- Each file should have a single responsibility.
- Keep functions small and focused — one function, one job.
- Prefer composition over inheritance.
- No dead code. Remove unused imports, variables, and functions.

### Architecture
- Server components by default. Only use `"use client"` when interactivity is required (event handlers, hooks, browser APIs).
- Use server actions for mutations. Use route handlers only for webhooks and external API endpoints.
- Colocate related code: queries near their usage, components near their routes.
- Problems are the primary navigation entry point. Projects are secondary (accessed via problem pages).

### Agent Linkage
- The `AgentActions` component dispatches issue context to AI agents via CLI commands (Claude Code), deep links (Cursor), or browser fallbacks (Claude, ChatGPT).
- The `/api/issues/[id]/context` endpoint returns plain-text issue context for CLI piping (e.g., `curl ... | claude`).
- GitHub PR commenting uses a server-side `GITHUB_TOKEN` (optional). Comments are fire-and-forget — review flow works without it.
- SVG icons for Claude, Cursor, and VS Code are inlined from Simple Icons (MIT licensed) — no icon library dependency.

### Naming Conventions
- **Components**: PascalCase (`IssueCard.tsx`)
- **Utilities/functions**: camelCase (`calculateScore.ts`)
- **Routes**: kebab-case (`/projects/[slug]/issues`)
- **Database tables/columns**: snake_case (`citizen_score`, `assigned_to`)
- **Types/Interfaces**: PascalCase (`CitizenProfile`, `SDGCategory`)
- **Constants/Enums**: UPPER_SNAKE_CASE for enum values, PascalCase for enum names

### Code Hygiene
- Consistent formatting (Prettier defaults).
- No `any` types — use proper TypeScript types or `unknown` with narrowing.
- Prefer `const` over `let`. Never use `var`.
- Use early returns to reduce nesting.
- Destructure props and function parameters.

### Testing
- Use Vitest + React Testing Library.
- Collocate test files with source (`component.tsx` -> `component.test.tsx`).
- Test behavior, not implementation details.
- Write tests for server actions, utility functions, and critical UI flows.

### Caching & Performance
- Server components by default (zero client JS where possible).
- Use `next/image` for all images — never raw `<img>` tags.
- Use `next/font` for font loading.
- Lazy load heavy components with `React.lazy` or dynamic imports.
- Use proper indexes on database queries (see schema).
- Avoid N+1 queries — use joins or batch fetches.

### Security
- Validate all inputs with zod at API boundaries (server actions, route handlers).
- Sanitize user-generated content before rendering.
- Use parameterized queries (Drizzle handles this).
- Rate limit public API endpoints.
- Never expose service role keys or secrets to the client.
- Check auth and ownership before any mutation.

### Database
- Use Drizzle ORM for all database operations.
- All schema changes require migrations (`drizzle-kit generate`).
- Add proper indexes for frequently queried columns.
- Use foreign keys with appropriate cascade rules.
- Use uuid for primary keys.

## Branching Strategy

| Prefix | Purpose |
|--------|---------|
| `feature/` | New features |
| `chore/` | Maintenance, refactoring, dependency updates |
| `fix/` | Bug fixes |

## Pull Request Titles

| Branch Type | PR Title Format |
|-------------|----------------|
| `feature/` | `[Feature] - Description` |
| `fix/` | `[Fix] - Description` |
| `chore/` | `[Chore] - Description` |

## Repo Structure

```
citizen/
├── apps/
│   └── web/                     # Next.js 14 app
│       └── src/
│           ├── app/             # App Router pages and API routes
│           │   └── api/
│           │       ├── issues/[id]/context/  # Public context endpoint (CLI piping)
│           │       └── webhooks/github/      # GitHub webhook handler
│           ├── components/      # React components by feature
│           ├── lib/
│           │   ├── db/          # Drizzle client, schema, queries
│           │   ├── github/      # GitHub API helpers (PR commenting, URL parsing)
│           │   ├── supabase/    # Supabase client (server/browser)
│           │   ├── auth/        # Auth helpers
│           │   └── score/       # Citizen score calculation
│           └── types/           # TypeScript type definitions
├── packages/
│   └── db/                      # Shared Drizzle schema (future)
├── workers/
│   └── score-worker/            # Background jobs (Phase 2)
├── CLAUDE.md
├── AGENTS.md
└── README.md
```
