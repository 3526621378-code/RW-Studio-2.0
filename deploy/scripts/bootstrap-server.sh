#!/usr/bin/env bash

set -Eeuo pipefail

readonly APP_USER="rwstudio"
readonly APP_GROUP="rwstudio"
readonly APP_HOME="/var/lib/rwstudio"
readonly APP_DIR="/opt/rw-studio"
readonly REPOSITORY_URL="https://github.com/3526621378-code/RW-Studio-2.0.git"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

dnf install -y nginx git

if ! getent group "${APP_GROUP}" >/dev/null; then
  groupadd --system "${APP_GROUP}"
fi

if ! id "${APP_USER}" >/dev/null 2>&1; then
  useradd \
    --system \
    --gid "${APP_GROUP}" \
    --home-dir "${APP_HOME}" \
    --create-home \
    --shell /sbin/nologin \
    "${APP_USER}"
fi

if [[ -e "${APP_DIR}" && ! -d "${APP_DIR}/.git" ]]; then
  echo "${APP_DIR} exists but is not an RW Studio Git checkout." >&2
  exit 1
fi

if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone --branch main --single-branch "${REPOSITORY_URL}" "${APP_DIR}"
fi

chown -R "${APP_USER}:${APP_GROUP}" "${APP_DIR}" "${APP_HOME}"

runuser -u "${APP_USER}" -- env \
  HOME="${APP_HOME}" \
  NEXT_TELEMETRY_DISABLED=1 \
  npm --prefix "${APP_DIR}" ci

runuser -u "${APP_USER}" -- env \
  HOME="${APP_HOME}" \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_OPTIONS="--max-old-space-size=1024" \
  npm --prefix "${APP_DIR}" run build

install -d -o "${APP_USER}" -g "${APP_GROUP}" "${APP_DIR}/.next/cache"

if [[ -f /etc/nginx/nginx.conf && ! -f /etc/nginx/nginx.conf.rw-studio-original ]]; then
  install -m 0644 /etc/nginx/nginx.conf /etc/nginx/nginx.conf.rw-studio-original
fi

install -m 0644 "${APP_DIR}/deploy/nginx/nginx.conf" /etc/nginx/nginx.conf
install -m 0644 "${APP_DIR}/deploy/systemd/rw-studio.service" /etc/systemd/system/rw-studio.service

nginx -t
systemctl daemon-reload
systemctl enable --now rw-studio.service
systemctl enable --now nginx.service

curl --fail --silent --show-error http://127.0.0.1:3000/ >/dev/null
curl --fail --silent --show-error http://127.0.0.1/healthz

echo "RW Studio bootstrap completed."
