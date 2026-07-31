import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("keeps the mainland deployment isolated from existing services", async () => {
  const [service, bootstrap, update] = await Promise.all([
    read("deploy/systemd/rw-studio.service"),
    read("deploy/scripts/bootstrap-server.sh"),
    read("deploy/scripts/update-server.sh"),
  ]);

  assert.match(service, /User=rwstudio/);
  assert.match(service, /127\.0\.0\.1/);
  assert.match(service, /EnvironmentFile=-\/etc\/rw-studio\.env/);
  assert.match(service, /NoNewPrivileges=true/);
  assert.match(bootstrap, /RW_STUDIO_REPOSITORY_URL/);
  assert.match(bootstrap, /registry\.npmmirror\.com/);
  assert.match(update, /merge --ff-only origin\/main/);
  assert.doesNotMatch(service, /11950/);
});

test("routes the filed domains without exposing the website by raw IP", async () => {
  const [httpConfig, httpsConfig] = await Promise.all([
    read("deploy/nginx/nginx.conf"),
    read("deploy/nginx/nginx.https.conf"),
  ]);

  for (const config of [httpConfig, httpsConfig]) {
    assert.match(config, /server_name rw-studio\.cn www\.rw-studio\.cn;/);
    assert.match(config, /proxy_pass http:\/\/127\.0\.0\.1:3000;/);
    assert.match(config, /server_name _;[\s\S]*?return 444;/);
  }

  assert.match(httpsConfig, /ssl_protocols TLSv1\.2 TLSv1\.3;/);
  assert.match(httpsConfig, /\/etc\/letsencrypt\/live\/rw-studio\.cn/);
  assert.match(httpsConfig, /301 https:\/\/rw-studio\.cn\$request_uri/);
});

test("has placeholders for every post-filing value without fake numbers", async () => {
  const [environment, checklist, compliance] = await Promise.all([
    read("deploy/env/rw-studio.env.example"),
    read("deploy/POST_FILING_CHECKLIST.md"),
    read("app/components/SiteCompliance.jsx"),
  ]);

  assert.match(environment, /SITE_URL=https:\/\/rw-studio\.cn/);
  assert.match(environment, /FILING_SITE_NAME=若雾拾光/);
  assert.match(environment, /^ICP_NUMBER=$/m);
  assert.match(environment, /^PUBLIC_SECURITY_NUMBER=$/m);
  assert.match(checklist, /121\.40\.38\.200/);
  assert.match(checklist, /公安联网备案资料/);
  assert.match(compliance, /return null/);
  assert.doesNotMatch(environment, /TEST|XXXXXXXX/);
});

test("validates DNS before enabling a real HTTPS certificate", async () => {
  const script = await read("deploy/scripts/enable-https.sh");

  assert.match(script, /PUBLIC_IP="121\.40\.38\.200"/);
  assert.match(script, /getent ahostsv4/);
  assert.match(script, /certbot certonly/);
  assert.match(script, /--webroot/);
  assert.match(script, /nginx -t/);
});
