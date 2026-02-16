# HostelHub

Next.js + PostgreSQL hostel management app.

## Deploy On A New Machine (Docker Desktop)

### Prerequisites

- Docker Desktop is installed and running.
- On Windows, make sure WSL2 backend is enabled in Docker Desktop.

### Quick Start

Fast path (recommended):

PowerShell:

```powershell
.\scripts\deploy.ps1
```

macOS/Linux:

```bash
sh ./scripts/deploy.sh
```

Manual path:

1. Go to project folder (`hostelhub`) and copy env template:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Build and start app + database:

```bash
docker compose up --build -d --remove-orphans
```

3. Verify containers are healthy:

```bash
docker compose ps
```

4. Open:

- App: `http://localhost:3000`
- Postgres: `localhost:5432`

5. Optional demo data seed:

```bash
docker compose --profile seed run --rm seed
```

6. Optional pgAdmin:

```bash
docker compose --profile pgadmin up -d
```

Open pgAdmin at `http://localhost:5050`.

Optional flags for deploy scripts:

- PowerShell: `.\scripts\deploy.ps1 -WithPgAdmin -WithSeed`
- macOS/Linux: `sh ./scripts/deploy.sh --with-pgadmin --with-seed`

## Port Configuration

You can change host ports in `.env` if defaults are busy:

- `APP_PORT` (default `3000`)
- `DB_PORT` (default `5432`)
- `PGADMIN_PORT` (default `5050`)

After changing ports:

```bash
docker compose down --remove-orphans
docker compose up -d --build --remove-orphans
```

## Common Fixes

### Port already in use

If Docker shows `Only one usage of each socket address`:

- Find process using a port:
  - PowerShell: `Get-NetTCPConnection -State Listen | ? LocalPort -eq 3000`
- Stop the process (replace PID):
  - PowerShell: `Stop-Process -Id <PID> -Force`
- Start stack again:
  - `docker compose up -d --remove-orphans`

### Orphan containers/network

```bash
docker compose down --remove-orphans
docker network prune -f
```

### Docker engine / WSL startup issue (Windows)

Run in Administrator PowerShell, then reboot:

```powershell
wsl --shutdown
netsh winsock reset
netsh int ip reset
```

## Local Development (Without Docker)

1. Install deps:

```bash
npm install
```

2. Create `.env` from `.env.example` and point `DATABASE_URL` to your local Postgres.

3. Run:

```bash
npm run dev
```

4. Build and run production locally:

```bash
npm run build
npm run start
```

## Notes

- `docker-compose.yml` includes:
  - `db`: PostgreSQL 15
  - `app`: production Next.js container
  - `seed` profile: one-off data seeding using `scripts/seed-db.js`
  - `pgadmin` profile: optional DB UI
- DB schema initialization runs automatically from `scripts/init-db.sql` on first DB boot.
