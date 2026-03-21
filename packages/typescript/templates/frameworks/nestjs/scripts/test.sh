#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 [unit|e2e]"
  echo ""
  echo "  unit - Run unit tests in Docker."
  echo "  e2e  - Run e2e tests in Docker."
  exit 1
fi

ACTION="$1"

# Customize these service names per project
BACKEND_UNIT_SERVICE="backend-test-unit"
BACKEND_E2E_SERVICE="backend-test-e2e"

case "$ACTION" in
  unit)
    echo "Running unit tests in Docker..."
    docker compose --env-file .env --profile test-unit up --build --renew-anon-volumes --abort-on-container-exit "$BACKEND_UNIT_SERVICE"
    docker compose --profile test-unit down -v
    ;;
  e2e)
    echo "Running e2e tests in Docker..."
    docker compose --env-file .env --profile test-e2e up --build --renew-anon-volumes --abort-on-container-exit "$BACKEND_E2E_SERVICE"
    docker compose --profile test-e2e down -v
    ;;
  *)
    echo "Error: Invalid action '$ACTION'"
    echo "Usage: $0 [unit|e2e]"
    exit 1
    ;;
esac
