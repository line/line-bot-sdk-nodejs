#!/usr/bin/env bash
set -euo pipefail

IFS=$'\n'
locks=($(find . -path '*/node_modules' -prune -o -name package-lock.json -print))
unset IFS

declare -a failed=()

for lock in "${locks[@]}"; do
  dir=$(dirname "$lock")
  printf '\n\n\033[1;34m==> %s\033[0m\n' "$dir"

  pushd "$dir" >/dev/null
  if ! npm audit --audit-level moderate; then
    failed+=("$dir")
  fi
  popd >/dev/null
done

if ((${#failed[@]})); then
  echo -e "\n\033[0;31mnpm audit reported vulnerabilities in:\033[0m"
  printf '  - %s\n' "${failed[@]}"
  exit 1
else
  echo "npm audit passed: no vulnerabilities detected"
  exit 0
fi
