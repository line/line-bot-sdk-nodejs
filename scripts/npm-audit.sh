find . -name package-lock.json \
      -not -path "./node_modules/*" \
      -execdir sh -c '
        printf "\033[1;34m==> %s\033[0m\n" "$PWD"
        npm audit fix --force
      ' \;

if [ -n "$(git status --porcelain)" ]; then
    echo "Changes detected after 'npm audit fix'"
    exit 1
else
    echo "No changes detected after 'npm audit fix'"
fi
