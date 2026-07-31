#!/usr/bin/env bash

set -Eeuo pipefail

readonly APP_USER="rwstudio"
readonly APP_HOME="/var/lib/rwstudio"
readonly APP_DIR="/opt/rw-studio"
readonly NPM_REGISTRY="${RW_STUDIO_NPM_REGISTRY:-https://registry.npmmirror.com}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

if [[ ! -d "${APP_DIR}/.git" ]]; then
  echo "RW Studio is not installed at ${APP_DIR}." >&2
  exit 1
fi

if [[ -n "$(git -C "${APP_DIR}" status --porcelain)" ]]; then
  echo "The server checkout has local changes; update stopped safely." >&2
  exit 1
fi

runuser -u "${APP_USER}" -- git -C "${APP_DIR}" fetch --prune origin main
runuser -u "${APP_USER}" -- git -C "${APP_DIR}" merge --ff-only origin/main

runuser -u "${APP_USER}" -- env \
  HOME="${APP_HOME}" \
  NPM_CONFIG_REGISTRY="${NPM_REGISTRY}" \
  NEXT_TELEMETRY_DISABLED=1 \
  npm --prefix "${APP_DIR}" ci

runuser -u "${APP_USER}" -- env \
  HOME="${APP_HOME}" \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_OPTIONS="--max-old-space-size=1024" \
  npm --prefix "${APP_DIR}" run build

install -d -o "${APP_USER}" -g "${APP_USER}" "${APP_DIR}/.next/cache"
systemctl restart rw-studio.service

curl --fail --silent --show-error http://127.0.0.1:3000/ >/dev/null
curl --fail --silent --show-error --header "Host: rw-studio.cn" http://127.0.0.1/healthz

echo "RW Studio update completed."
