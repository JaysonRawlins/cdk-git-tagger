#!/usr/bin/env bash
set -euo pipefail

# Skip if the last commit is a release commit
if git log --oneline -1 | grep -q "chore(release):"; then
  echo "Last commit is a release commit — skipping bump."
  exit 0
fi

mkdir -p dist

# Run commit-and-tag-version to bump version in package.json and generate changelog
npx commit-and-tag-version --skip.commit --skip.tag

# Read the new version from package.json
VERSION=$(node -p "require('./package.json').version")

echo "$VERSION" > dist/version.txt
echo "v$VERSION" > dist/releasetag.txt

# Generate changelog for this release only
# commit-and-tag-version already updated CHANGELOG.md — extract the latest entry
node -e "
const fs = require('fs');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const lines = changelog.split('\n');
let content = [];
let started = false;
for (const line of lines) {
  if (line.startsWith('## ') || line.startsWith('### ')) {
    if (started) break;
    started = true;
  }
  if (started) content.push(line);
}
fs.writeFileSync('dist/changelog.md', content.join('\n') + '\n');
"

echo "Bumped to version $VERSION"
