---
description: How to deploy and host the HostelHub platform
---

# Deploying HostelHub

This guide provides instructions for deploying the HostelHub platform using Docker, which is the recommended method for professional hosting.

## Prerequisites
- A server (VPS) with Linux (e.g., Ubuntu 22.04)
- Docker and Docker Compose installed
- A domain name (optional, but recommended)

## 1. Environment Configuration

Create a `.env` file in the root directory of your project on the server:

```env
DATABASE_URL=postgresql://user:password@db:5432/hostelhub
JWT_SECRET=your_super_secret_random_string
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NODE_ENV=production
```

## 2. Deployment Steps

Since the project includes a `docker-compose.yml` and a `Dockerfile`, deployment is straightforward.

### local build & run
If you want to run it on your local machine in production mode:
// turbo
```bash
docker-compose up --build -d
```

### Server Deployment
1. **Clone the repository** to your server.
2. **Configure your .env** as shown above.
3. **Run Docker Compose**:
```bash
docker-compose up --build -d
```

## 3. Database Initialization & Seeding

After the containers are up, you need to initialize the database schema and add dummy data.

### Initialize Schema
```bash
docker-compose exec app node scripts/init-db.js
```

### Seed Dummy Data
```bash
docker-compose exec app node scripts/seed-db.js
```

## 4. Hosting with SSL (Nginx Reverse Proxy)

For production hosting, it is recommended to use Nginx as a reverse proxy with Let's Encrypt for SSL.

### Example Nginx Config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 5. Security Posture

The platform is now hardened with:
- **Parameterized SQL Queries**: Protection against standard SQL injection.
- **Strict Whitelisting**: Protection against property-injection in dynamic updates.
- **RBAC Middleware**: Role-based access control for all sensitive endpoints.
- **IDOR Protection**: Ownership checks for all student data.
- **Security Headers**: XSS, Frame-Options, and CSP protections enabled in `next.config.ts`.
