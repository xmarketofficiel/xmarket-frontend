#!/bin/bash

# Clear Next.js cache and restart development server
echo "🧹 Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "🚀 Starting development server..."
npm run dev
