#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🌱 Running database seed..."
./seed || echo "⚠️  Seed failed or data already exists"

echo "🚀 Starting server..."
exec ./main
