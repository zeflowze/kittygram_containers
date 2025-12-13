#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$HOME/kittygram}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.production.yml}"

cd "$PROJECT_DIR"

echo "[1/5] Pull images"
sudo docker compose -f "$COMPOSE_FILE" pull

echo "[2/5] Start containers"
sudo docker compose -f "$COMPOSE_FILE" up -d

echo "[3/5] Apply migrations"
sudo docker compose -f "$COMPOSE_FILE" exec backend python manage.py migrate --noinput

echo "[4/5] Collect static"
sudo docker compose -f "$COMPOSE_FILE" exec backend python manage.py collectstatic --noinput

echo "[5/5] Show status"
sudo docker compose -f "$COMPOSE_FILE" ps
