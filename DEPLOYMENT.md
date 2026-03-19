# Deployment

## Docker Compose

1. Copy `.env.java-angular.example` to `.env`.
2. Set real secrets and ports for your environment.
3. Start the stack:

```bash
docker compose -f docker-compose.java-angular.yml --env-file .env up -d --build
```

## Services

- Angular app: `http://localhost:4200`
- Spring Boot API: `http://localhost:8080`
- Spring health: `http://localhost:8080/actuator/health`

## Notes

- The Angular container proxies `/api/*` and `/actuator/health` to the Spring Boot container.
- Flyway runs automatically when the API starts.
- The API requires PostgreSQL and reads configuration from environment variables or `*_FILE` secret paths.
- For production, prefer `POSTGRES_PASSWORD_FILE` and `JWT_SECRET_FILE` over plain env values.
- `JWT_SECRET` is required and the API will refuse to start if it is missing, too short, or still a placeholder.
- Password reset URLs are hidden by default and are only returned when `EXPOSE_DEV_RESET_URL=true`.
