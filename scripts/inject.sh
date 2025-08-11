#!/bin/bash

# Exit on errors
set -e

echo "🔐 Injecting FLAG_SECURE into MainActivity.kt..."

# Path to MainActivity.kt
MAIN_ACTIVITY="./android/app/src/main/java/com/jyrwaboys/lilkingman/MainActivity.kt"

# Check if MainActivity.kt exists
if [ ! -f "$MAIN_ACTIVITY" ]; then
  echo "❌ MainActivity.kt not found at $MAIN_ACTIVITY"
  exit 1
fi

# Check if FLAG_SECURE is already present
if grep -q "WindowManager.LayoutParams.FLAG_SECURE" "$MAIN_ACTIVITY"; then
  echo "✅ FLAG_SECURE already present. Skipping injection."
else
  echo "✅ Injecting FLAG_SECURE..."
  # Inject the flag after `super.onCreate(null)`
  sed -i '' '/super.onCreate(null)/a\
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
  ' "$MAIN_ACTIVITY"
fi

echo "✅ Injection done!"
