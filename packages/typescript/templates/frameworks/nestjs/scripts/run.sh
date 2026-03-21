#!/bin/bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 [dev] [up|down]"
  echo ""
  echo "  dev  - Development environment."
  echo ""
  echo "  up   - Start containers."
  echo "  down - Stop and remove containers."
  exit 1
fi

ENVIRONMENT="$1"
ACTION="$2"

if [ ! -f .env ]; then
  echo "Error: .env file not found"
  exit 1
fi

APP_NAME_SLUG=$(grep -m1 '^APP_NAME_SLUG=' .env | cut -d= -f2)

if [ -z "$APP_NAME_SLUG" ]; then
  echo "Error: APP_NAME_SLUG not defined in .env"
  exit 1
fi

case "$ENVIRONMENT" in
  dev)
    PROFILE="development"
    NODE_MODULES_VOLUME="${APP_NAME_SLUG}-node-modules-development"
    ;;
  *)
    echo "Error: Invalid environment '$ENVIRONMENT'"
    echo "Usage: $0 [dev] [up|down]"
    exit 1
    ;;
esac

case "$ACTION" in
  up)
    # Remove node_modules volume if package-lock.json changed since last build
    LOCAL_HASH=$(sha256sum package-lock.json | cut -d' ' -f1)
    VOLUME_HASH=$(docker run --rm -v "$NODE_MODULES_VOLUME":/vol alpine cat /vol/.package-lock-hash 2>/dev/null || echo "")

    if [ "$LOCAL_HASH" = "$VOLUME_HASH" ]; then
      echo "package-lock.json unchanged, reusing node_modules volume."
    else
      echo "package-lock.json changed, recreating node_modules volume..."
      docker volume rm "$NODE_MODULES_VOLUME" 2>/dev/null || true
    fi

    echo "Starting $ENVIRONMENT containers..."
    docker compose --env-file .env --profile "$PROFILE" up --remove-orphans --build
    ;;
  down)
    echo "Stopping $ENVIRONMENT containers..."
    docker compose --env-file .env --profile "$PROFILE" down
    ;;
  *)
    echo "Error: Invalid action '$ACTION'"
    echo "Usage: $0 [dev] [up|down]"
    exit 1
    ;;
esac
