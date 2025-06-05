#!/bin/bash

# Define variables
REPO_URL="https://github.com/Farzanehsedarati610/index.git"
LOCAL_DIR="$HOME/index-repo"

# Clone repo if it doesn't exist, else update
if [ ! -d "$LOCAL_DIR" ]; then
    echo "Cloning repository..."
    git clone "$REPO_URL" "$LOCAL_DIR"
else
    echo "Updating repository..."
    cd "$LOCAL_DIR"
    git pull origin main
fi

# Add files
echo "Adding files..."
cd "$LOCAL_DIR"
git add .

# Commit and push changes
echo "Committing changes..."
git commit -m "Automated deployment update"
git push origin main

echo "Deployment complete!"

