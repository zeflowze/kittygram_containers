#!/usr/bin/env bash
set -euo pipefail

echo "Cleaning server caches and Docker artifacts..."
npm cache clean --force || true
sudo apt clean
sudo journalctl --vacuum-time=1d || true
sudo docker system prune -af

echo "Create project directory ~/kittygram (if missing)"
mkdir -p "$HOME/kittygram"

echo "Done."
