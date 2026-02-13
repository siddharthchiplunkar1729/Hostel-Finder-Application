# HostelHub

Next.js + PostgreSQL hostel management app.

## Run with Docker Desktop (recommended)

1. Copy env template:
```bash
cp .env.example .env
```
PowerShell:
```powershell
Copy-Item .env.example .env
```

2. Build and start app + database:
```bash
docker compose up --build -d
```

3. Seed mock data (optional but useful for demos):
```bash
docker compose --profile seed run --rm seed
```

4. Open:
- App: http://localhost:3000
- Postgres: localhost:5432

5. Stop:
```bash
docker compose down
```

6. Stop and remove DB volume too:
```bash
docker compose down -v
```

## Local development (without Docker)

1. Install deps:
```bash
npm install
```

2. Create `.env` from `.env.example` and point `DATABASE_URL` to your Postgres.

3. Run:
```bash
npm run dev
```

4. Build:
```bash
npm run build
npm run start
```

## Notes

- `docker-compose.yml` includes:
  - `db`: PostgreSQL 15
  - `app`: production Next.js container
  - `seed` profile: one-off data seeding using `scripts/seed-db.js`
- DB schema initialization runs automatically from `scripts/init-db.sql` on first DB boot.
