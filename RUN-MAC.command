#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "=============================="
echo "      Starting MovieHunt"
echo "=============================="
echo ""
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node.js LTS from https://nodejs.org/ and run this file again."
  read -p "Press Enter to close..."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installing project packages for the first run..."
  npm install || exit 1
fi
(sleep 2 && open http://localhost:5173) &
npm run dev
