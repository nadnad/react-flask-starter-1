#!/bin/bash
set -e

echo "Setting up development environment..."

# Configure git if not already configured
if [ ! -f /root/.gitconfig ]; then
    git config --global user.name "${GIT_USER_NAME}"
    git config --global user.email "${GIT_USER_EMAIL}"
    git config --global init.defaultBranch main
    git config --global pull.rebase false
fi

# Authenticate with GitHub CLI if token is provided
if [ -n "${GITHUB_TOKEN}" ]; then
    echo "${GITHUB_TOKEN}" | gh auth login --with-token
    echo "✓ GitHub CLI authenticated"
fi

# Clone repository if specified
if [ -n "${REPO_URL}" ]; then
    REPO_NAME=$(basename "${REPO_URL}" .git)
    
    if [ ! -d "/workspace/${REPO_NAME}" ]; then
        echo "Cloning repository: ${REPO_URL}"
        cd /workspace
        git clone "${REPO_URL}"
        cd "${REPO_NAME}"
        
        # Create and checkout branch
        if [ -n "${BRANCH_NAME}" ]; then
            git checkout -b "${BRANCH_NAME}" || git checkout "${BRANCH_NAME}"
            echo "✓ Checked out branch: ${BRANCH_NAME}"
        fi
        
        # Change working directory to the cloned repo
        export REPO_PATH="/workspace/${REPO_NAME}"
        echo "✓ Repository cloned to: ${REPO_PATH}"
    else
        echo "✓ Repository already exists: /workspace/${REPO_NAME}"
        cd "/workspace/${REPO_NAME}"
    fi
fi

echo "✓ Development environment ready!"