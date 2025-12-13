# Kittygram — containers & CI/CD

This repository contains a Dockerized setup for Kittygram (Django + React + Nginx) and a GitHub Actions pipeline that:
- lints backend code (PEP8),
- runs backend and frontend tests,
- builds and pushes Docker images to Docker Hub,
- deploys to a remote server via Docker Compose,
- sends a Telegram notification on success.

## Services
- **db**: PostgreSQL 13 (volume: `pg_data`)
- **backend**: Django API (volume: `static`, `media`)
- **frontend**: React build copied into `static`
- **gateway**: Nginx reverse-proxy, serves `/static/` and `/media/`

## Quick start (local)
1. Create `.env` from `.env.example`
2. Run:
   ```bash
   docker compose up --build
   ```
3. Open: `http://localhost:9000`

## Production deploy
On the server, the pipeline places files into `~/kittygram/` and runs:
- migrations,
- collectstatic,
- container restart via Docker Compose.

Manual deploy (server):
```bash
cd ~/kittygram
chmod +x infra/scripts/deploy.sh
./infra/scripts/deploy.sh
```
