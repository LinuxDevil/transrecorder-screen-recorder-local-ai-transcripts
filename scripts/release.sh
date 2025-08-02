#!/bin/bash

# Release script for Screen Recorder
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 1.0.1

if [ $# -eq 0 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.1"
    exit 1
fi

VERSION=$1

echo "🚀 Creating release for version $VERSION"

# Check if we're on main/master branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
    echo "❌ Error: You must be on main or master branch to create a release"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean. Please commit or stash changes."
    exit 1
fi

# Create and push tag
echo "📝 Creating tag v$VERSION..."
git tag "v$VERSION"
git push origin "v$VERSION"

echo "✅ Tag v$VERSION created and pushed!"
echo ""
echo "🎉 The GitHub Actions workflow will now:"
echo "   1. Build Windows and macOS versions"
echo "   2. Create a GitHub release"
echo "   3. Upload all artifacts to the release"
echo ""
echo "📋 You can monitor the progress at:"
echo "   https://github.com/your-username/meetingvideo-transrecorder/actions"
echo ""
echo "📦 Once complete, users can download from:"
echo "   https://github.com/your-username/meetingvideo-transrecorder/releases"
