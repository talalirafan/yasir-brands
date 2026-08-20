# Nginx Load Balancer

This sets up a production stack for a single VPS: two backend replicas
behind an Nginx load balancer that also serves the built frontend.

```
                ┌────────────┐
  users ───────▶│   Nginx    │───▶ static frontend (dist/)
                │  (port 80) │
                └─────┬──────┘
                 least_conn
                ┌──────┴──────┐
                ▼             ▼
           backend1:3000  backend2:3000
                │             │
                └──────┬──────┘
                 shared "uploads" volume (product images)
```

## Run it

1. Make sure `backend/.env` is filled in (`MONGODB_URI`, `JWT_SECRET`, etc).
2. From the repo root:
   ```
   docker compose up -d --build
   ```
3. Visit `http://localhost` (or your server's IP/domain) — Nginx serves the
   app and load-balances `/api/*` and `/uploads/*` across `backend1` and
   `backend2`.

## Notes

- `least_conn` is used instead of plain round-robin since upload requests
  take longer than simple reads.
- Product image uploads are written to a shared Docker volume (`uploads`)
  so they're visible no matter which backend replica handled the request.
- To add a third replica, add a `backend3` service in `docker-compose.yml`
  (same `build`/`env_file`/volume as the others) and a matching
  `server backend3:3000;` line in `nginx/nginx.conf`, then
  `docker compose up -d --build`.
- For a real domain with HTTPS, put Nginx behind Certbot (or terminate TLS
  with a managed load balancer) — this config is HTTP-only.
