#!/usr/bin/env bash
set -euo pipefail

echo "=== Test project ==="
NODE_OPTIONS=--max-old-space-size=6144 npm test

echo "=== Build apidocs ==="
NODE_OPTIONS=--openssl-legacy-provider npm run apidocs

echo "=== Build docs ==="
NODE_OPTIONS=--openssl-legacy-provider npm run docs:build

for ex in echo-bot echo-bot-esm kitchensink rich-menu; do
  echo "=== Check example: $ex ==="
  (cd "examples/$ex" && npm ci && node --check index.js)
done

for ex in echo-bot-ts-cjs echo-bot-ts-esm; do
  echo "=== Build example: $ex ==="
  (cd "examples/$ex" && npm ci && npm run build-sdk && npm run build)
done

echo "=== publint ==="
npm run check:publint

echo "=== Validate package (attw) ==="
npm run check:attw
