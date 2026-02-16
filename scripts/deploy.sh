#!/usr/bin/env sh
set -eu

WITH_PGADMIN=0
WITH_SEED=0

for arg in "$@"; do
  case "$arg" in
    --with-pgadmin) WITH_PGADMIN=1 ;;
    --with-seed) WITH_SEED=1 ;;
    *)
      echo "Unknown option: $arg"
      echo "Usage: ./scripts/deploy.sh [--with-pgadmin] [--with-seed]"
      exit 1
      ;;
  esac
done

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

docker version >/dev/null

echo "Building and starting HostelHub containers..."
docker compose up -d --build --remove-orphans

if [ "$WITH_PGADMIN" -eq 1 ]; then
  echo "Starting pgAdmin profile..."
  docker compose --profile pgadmin up -d
fi

if [ "$WITH_SEED" -eq 1 ]; then
  echo "Running seed profile..."
  docker compose --profile seed run --rm seed
fi

get_env_value() {
  key="$1"
  default="$2"
  value="$(grep -E "^${key}=" .env | tail -n 1 | cut -d= -f2- || true)"
  if [ -z "${value}" ]; then
    echo "$default"
  else
    echo "$value"
  fi
}

APP_PORT="$(get_env_value APP_PORT 3000)"
DB_PORT="$(get_env_value DB_PORT 5432)"
PGADMIN_PORT="$(get_env_value PGADMIN_PORT 5050)"

echo "Waiting for app readiness on port ${APP_PORT}..."
i=0
while [ "$i" -lt 30 ]; do
  if curl -fsS "http://localhost:${APP_PORT}" >/dev/null 2>&1; then
    echo "App is reachable."
    break
  fi
  i=$((i + 1))
  sleep 2
done

if [ "$i" -eq 30 ]; then
  echo "App did not become reachable in time."
  exit 1
fi

echo ""
echo "Deployment complete."
echo "App:      http://localhost:${APP_PORT}"
echo "Postgres: localhost:${DB_PORT}"
if [ "$WITH_PGADMIN" -eq 1 ]; then
  echo "pgAdmin:  http://localhost:${PGADMIN_PORT}"
fi
