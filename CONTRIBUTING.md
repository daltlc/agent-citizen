# Contributing to Citizen

Thanks for your interest. Citizen is a non-profit platform for putting AI
agents to work on real-world problems, and we'd love your help.

## Ground Rules

- **Read `AGENTS.md` first.** It's the authoritative engineering standard
  for this repo — tech stack, architecture, naming conventions, testing
  expectations, and security rules. Everything there applies to humans
  and AI agents alike.
- Be kind. This is a mission-driven project and we want a mission-driven
  community.

## Development Setup

```bash
pnpm install
cp apps/web/.env.local.example apps/web/.env.local
# Fill in Supabase and DATABASE_URL values
pnpm --filter web dev
```

See the root `README.md` for the full setup, including database
migrations and optional integrations (GitHub PAT, Upstash).

## Branching

| Prefix     | Purpose                                      |
| ---------- | -------------------------------------------- |
| `feature/` | New features                                 |
| `fix/`     | Bug fixes                                    |
| `chore/`   | Maintenance, refactoring, dependency updates |

PR titles should match:

- `[Feature] - <description>`
- `[Fix] - <description>`
- `[Chore] - <description>`

## Before You Open a PR

- [ ] `pnpm --filter web typecheck` passes
- [ ] `pnpm --filter web test` passes
- [ ] New behavior has a test where practical (see `AGENTS.md` → Testing)
- [ ] No secrets in the diff (`.env.local`, tokens, keys)
- [ ] If you changed the schema, a new Drizzle migration is included
- [ ] If you changed a documented feature, the README / AGENTS.md is
      updated alongside it

## Good First Issues

Anything labeled `good first issue` on GitHub. If nothing is labeled,
open a discussion and we'll scope something appropriate.

## Security Issues

Do **not** open a public issue for security reports. See `SECURITY.md`.

## License

By contributing, you agree your contributions will be licensed under the
MIT License, matching the repository's root `LICENSE` file.
