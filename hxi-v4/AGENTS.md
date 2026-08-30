# HXI-4 — Agent Notes

This project is connected to Lovable (ID: `daddeade-7b69-4b6a-bda8-e3e3acab8645`).

When Lovable is the primary editor, avoid rewriting published commit history on the
`main` branch. If both Claude and Lovable are active, coordinate on a feature branch.

## No backend services

HXI-4 has no Supabase integration. All content is static. There are no server functions
that require environment credentials.

## Tech stack

- TanStack Start (SSR) + React 19 + TypeScript
- Tailwind CSS v4 with `@theme inline` + `@utility` glitch layers
- shadcn/ui (new-york style, Radix UI)
- Bun runtime, Vinxi builder
- `@lovable.dev/vite-tanstack-config` wrapper
