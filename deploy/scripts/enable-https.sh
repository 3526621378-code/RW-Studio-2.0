#!/usr/bin/env bash

set -Eeuo pipefail

readonly DOMAIN="rw-studio.cn"
readonly WWW_DOMAIN="www.rw-studio.cn"
readonly PUBLIC_IP="121.40.38.200"
readonly APP_DIR="/opt/rw-studio"
readonly CERTBOT_ROOT="/var/www/certbot"
readonly CERTBOT_EMAIL="${1:-}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

if [[ -z "${CERTBOT_EMAIL}" ]]; then
  echo "Usage: $0 <certificate-contact-email>" >&2
  exit 1
fi

for host in "${DOMAIN}" "${WWW_DOMAIN}"; do
  if ! getent ahostsv4 "${host}" | awk '{print $1}' | grep -Fxq "${PUBLIC_IP}"; then
    echo "${host} does not resolve to ${PUBLIC_IP}; HTTPS was not changed." >&2
    exit 1
  fi
done

if [[ ! -f "${APP_DIR}/deploy/nginx/nginx.https.conf" ]]; then
  echo "HTTPS Nginx configuration is missing from ${APP_DIR}." >&2
  exit 1
fi

dnf install -y certbot
install -d -o nginx -g nginx "${CERTBOT_ROOT}"

certbot certonly \
  --non-interactive \
  --agree-tos \
  --no-eff-email \
  --email "${CERTBOT_EMAIL}" \
  --webroot \
  --webroot-path "${CERTBOT_ROOT}" \
  --domain "${DOMAIN}" \
  --domain "${WWW_DOMAIN}"

install -m 0644 "${APP_DIR}/deploy/nginx/nginx.https.conf" /etc/nginx/nginx.conf
nginx -t
systemctl reload nginx.service

if systemctl list-unit-files certbot-renew.timer >/dev/null 2>&1; then
  systemctl enable --now certbot-renew.timer
elif systemctl list-unit-files certbot.timer >/dev/null 2>&1; then
  systemctl enable --now certbot.timer
fi

curl --fail --silent --show-error "https://${DOMAIN}/healthz"
echo "RW Studio HTTPS is enabled."
