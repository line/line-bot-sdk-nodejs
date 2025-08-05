#!/usr/bin/env bash
set -euo pipefail

errors=0

find . -name package-lock.json -not -path "./node_modules/*" -print0 |
  xargs -0 -n1 dirname | sort -u |
  while IFS= read -r dir; do
    printf '\n\n\n'
    printf '\033[1;34m==> %s\033[0m\n' "$dir"
    (cd "$dir" && npm audit) || errors=1
  done

if [ "$errors" -eq 0 ]; then
  echo "npm audit passed: no vulnerabilities detected"
else
  echo "npm audit reported vulnerabilities. Fix all vulnerabilities before committing."
fi

exit "$errors"
