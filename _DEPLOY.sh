#!/bin/bash
# Run this from your locatalyze repo directory to push the fixes
set -e
cd "$(dirname "$0")"
echo "→ Pushing fixes to GitHub (triggers Vercel auto-deploy)..."
git push origin main
echo "✓ Pushed. Vercel will deploy in ~60 seconds."
echo "  Check: https://vercel.com/dashboard"
