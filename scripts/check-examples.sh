#!/usr/bin/env bash
set -euo pipefail

for dir in examples/*/; do
  case "$dir" in
    examples/echo-bot-ts-cjs/ | examples/echo-bot-ts-esm/)
      # TypeScript examples are built in dedicated CI steps.
      continue
      ;;
  esac

  echo "::group::${dir%/}"
  (
    cd "$dir"

    if [ -f package-lock.json ]; then
      npm ci
    else
      npm install --package-lock=false
    fi

    found_js=0
    for file in *.js *.cjs *.mjs; do
      if [ -f "$file" ]; then
        found_js=1
        node --check "$file"
      fi
    done

    if [ "$found_js" -eq 0 ]; then
      echo "No JS files to syntax-check."
    fi
  )
  echo "::endgroup::"
done
