#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'Deploy docs'

git push -f git@github.com:line/line-bot-sdk-nodejs.git master:gh-pages

cd -
