#!/usr/bin/env bash
set -euo pipefail

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "[deploy] Missing required environment variable: ${name}" >&2
    exit 1
  fi
}

# --- Configuration ---
require_env "AWS_REGION"
require_env "S3_BUCKET"
require_env "CLOUDFRONT_DISTRIBUTION_ID"

# SPA routes need their own uploaded copies of index.html so direct loads on CloudFront/S3 work.
SPA_ROUTES=("dashboard" "admin" "reset-password" "forgot-password" "verify-email" "auth/callback")

log() {
  echo "[deploy] $1"
}

# --- Build ---
log "Building Vite bundle..."
npm install
npm run build   # produces dist/

# --- Upload to S3 ---
log "Syncing dist/ to s3://${S3_BUCKET}/"
aws s3 sync dist/ "s3://${S3_BUCKET}/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --region "${AWS_REGION}"

# For index.html / SPA fallback, overwrite cache headers:
log "Publishing SPA entrypoint"
aws s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" \
  --cache-control "no-cache" \
  --content-type "text/html" \
  --region "${AWS_REGION}"

# --- Pre-upload SPA fallback routes for S3/CloudFront refreshes ---
for route in "${SPA_ROUTES[@]}"; do
  log "Ensuring SPA fallback for /${route}"
  aws s3 cp dist/index.html "s3://${S3_BUCKET}/${route}" \
    --cache-control "no-cache" \
    --content-type "text/html" \
    --region "${AWS_REGION}"

  aws s3 cp dist/index.html "s3://${S3_BUCKET}/${route}/index.html" \
    --cache-control "no-cache" \
    --content-type "text/html" \
    --region "${AWS_REGION}"
done

# --- CloudFront Invalidation ---
if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID}" ]]; then
  log "Creating CloudFront invalidation..."
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths "/*" \
    --region "${AWS_REGION}"
fi

log "Deploy complete"
