# Laleche

E-commerce sajt za brend Concept Laleche — Next.js (App Router) + Prisma + SQLite.

## Pokretanje

```bash
npm install
npm run db:seed   # ubacuje test kategorije/proizvode i admin nalog
npm run dev
```

Sajt: http://localhost:3000
Admin panel: http://localhost:3000/admin (login: vidi `.env`, `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## Struktura

- `src/app/(site)` — javni sajt (početna, prodavnica, proizvod, korpa, porudžbina, kontakt, priča)
- `src/app/admin` — admin panel (kategorije, proizvodi, porudžbine), zaštićen login-om
- `prisma/schema.prisma` — model baze (kategorije, proizvodi, varijante, medija, porudžbine)
- `docs/brief/` — originalni brief i beleške o konceptu brenda

## Napomene

- Dev/build koriste `--webpack` umesto Turbopack-a zbog Turbopack CSS panic-a na ovom Windows okruženju.
- Slike/video proizvoda: trenutno placeholder SVG-ovi u `public/placeholders/`. Pravi materijal se dodaje kroz admin (Proizvodi → uređivanje → upload).
- Plaćanje je za sada samo pouzeće (COD) — integracija platnog procesora i fiskalizacija su naknadni korak.
