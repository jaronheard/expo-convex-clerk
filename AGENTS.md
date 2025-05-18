# Contributor Guide

Always consult the configuration rules in `.cursor/rules` before making changes. This repository contains a template Expo application that uses Convex for the backend and Clerk for authentication. Most application code lives in the following folders:

- `app/` – Expo Router pages
- `components/` – Reusable React components
- `hooks/` – Custom React hooks
- `constants/` – Miscellaneous constants
- `convex/` – Convex backend functions and schema
- `scripts/` – Maintenance scripts

## Dev Environment Tips
- Use **pnpm** for all package management tasks.
- Install dependencies with `pnpm install`.
- Start the Expo development server with `pnpm start`.

## Testing Instructions
This template does not include automated tests yet. Validate changes by running the linter:

```bash
pnpm lint
```

Ensure the command exits without errors before committing.
