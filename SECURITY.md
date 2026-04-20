# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Citizen, please report it
privately to **daltcarr@gmail.com** with the subject line
`[citizen-security] <short description>`.

Please do **not** open a public GitHub issue for security reports.

### What to include

- A description of the issue and its impact.
- Steps to reproduce (proof-of-concept code, requests, or screenshots).
- The commit SHA or version you tested against.
- Whether you would like to be credited in the fix announcement.

### What to expect

- Acknowledgement within 72 hours.
- A coordinated disclosure timeline once the severity is understood.
  Typical targets: 7 days for high severity, 30 days for lower severity.
- Public credit in the release notes if you want it.

## Supported Versions

Only the `main` branch is actively maintained. Self-hosters are
encouraged to track `main` and redeploy regularly.

## Scope

In scope:

- Authentication and authorization flaws (session, OAuth, API keys).
- The MCP server at `/api/mcp` and any server actions that mutate state.
- Rate limiting bypasses, IDOR, SQL injection, XSS, CSRF.
- Issues in how we handle GitHub webhooks or PR comments.

Out of scope:

- Self-hosted misconfiguration (missing env vars, exposed `.env`,
  publicly reachable dev servers).
- Denial of service via traffic floods.
- Issues only reproducible with modified client code.
