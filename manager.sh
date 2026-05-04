#!/bin/bash

# Inspire Automation Script
# Handles path conversion for WSL/Windows compatibility

# Path conversion block for WSL
if grep -q Microsoft /proc/version; then
    echo "WSL detected. Converting paths..."
    # Example: convert current path to Windows path if needed by some tools
    WIN_CWD=$(wslpath -w "$PWD")
fi

COMMAND=$1

case $COMMAND in
    "dev")
        echo "Starting all services in development mode..."
        npx concurrently "npm run dev -w apps/frontend" "npm run dev -w apps/admin" "npm run dev -w backend/*"
        ;;
    "build")
        echo "Building all modules..."
        npm run build --workspaces
        ;;
    "install")
        echo "Installing all dependencies..."
        npm install
        ;;
    *)
        echo "Usage: ./manager.sh {dev|build|install}"
        exit 1
        ;;
esac
