#!/usr/bin/env bash
set -euo pipefail

# Skip if the last commit is a release commit
if git log --oneline -1 | grep -q "chore(release):"; then
  echo "Last commit is a release commit — skipping bump."
  exit 0
fi

mkdir -p dist

# Resolve the latest version from git tags (same logic as projen's release/bump-version)
LATEST_TAG=$(git -c "versionsort.suffix=-" tag --sort="-version:refname" --list "v*" | head -n1)

if [ -z "$LATEST_TAG" ]; then
  echo "No existing version tags found — first release."
  LATEST_VERSION="0.0.0"
else
  # Strip the leading "v" prefix
  LATEST_VERSION="${LATEST_TAG#v}"
  echo "Latest version from git tags: $LATEST_VERSION"
fi

# Write the resolved version into package.json so commit-and-tag-version
# knows the correct starting point (package.json is normally reset to 0.0.0)
node -e "
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
p.version = '${LATEST_VERSION}';
fs.writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n');
"

# Run commit-and-tag-version to bump version and generate changelog
npx commit-and-tag-version --skip.commit --skip.tag

# Read the bumped version from package.json
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
