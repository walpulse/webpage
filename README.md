# Walpulse Webpage

Sitio web de producto de **Walpulse** — señales on-chain de reputación para wallets.

Principio rector: *creamos y analizamos señales; el receptor interpreta y decide.* No KYC, Travel Rule ni reportes a UIAF.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- `next-intl` — `es` (default), `pt`, `en`
- Hero: Three.js + `@react-three/fiber` + `@react-three/drei`
- Contacto: `POST /api/contacto` → Supabase RPC (`service_role`)

## Inicio rápido

```bash
npm install
cp .env.local.example .env.local   # completar keys
npm run dev
```

Documentación técnica: [`docs/README.md`](docs/README.md).

Fuente de verdad de producto: bóveda Obsidian Walpulse (`01 - Producto/Website/`).
