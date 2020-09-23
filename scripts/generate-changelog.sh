#!/bin/bash

git checkout ${GITHUB_HEAD_REF}

git config --global user.email "action@github.com"
git config --global user.name "GitHub Action"

npm run generate-changelog

git add -A
git commit -m "(Changelog CI) Added Changelog"
git push -u origin ${GITHUB_HEAD_REF}
