#!/usr/bin/env bash

# prepare gitbook
gitbook install

# clean and build
rm -rf docs/_book
gitbook build docs

# push the built doc to gh-pages
commit_message="Update docs"
cd docs/_book
git init
git commit --allow-empty -m "$commit_message"
git checkout -b gh-pages
git add .
git commit -am "$commit_message"
git push git@github.com:line/line-bot-sdk-nodejs.git gh-pages --force
