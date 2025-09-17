#!/bin/bash
set -e
set -x
cd /binarybiology/blog-api
echo "Removing node_modules and dist..."
rm -rf node_modules dist
echo "Installing npm packages..."
npm install
echo "Building TypeScript project..."
npm run build
echo "Stopping any existing PM2 process..."
pm2 delete blog-api || true
echo "Starting API with PM2..."
pm2 start npm --name blog-api -- run start