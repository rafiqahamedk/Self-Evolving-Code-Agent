# Git Commands to Update GitHub Repository

## Step 1: Initialize Git (if not already done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
```

## Step 2: Configure Git (first time only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Add Remote Repository (if not already added)

```bash
# Check existing remotes
git remote -v

# If no remote exists, add it:
git remote add origin https://github.com/rafiqahamedk/Self-Evolving-Code-Agent.git

# If remote exists but wrong URL, update it:
git remote set-url origin https://github.com/rafiqahamedk/Self-Evolving-Code-Agent.git
```

## Step 4: Stage All Changes

```bash
# Add all files to staging
git add .

# Or add specific files:
git add README.md
git add backend/
git add frontend/
```

## Step 5: Commit Changes

```bash
# Commit with a descriptive message
git commit -m "Complete Self-Evolving Code Agent with multi-agent system, test cases, and UI improvements"
```

## Step 6: Push to GitHub

```bash
# Push to main branch
git push -u origin main

# If your default branch is 'master', use:
git push -u origin master

# If you get an error about divergent branches, use:
git pull origin main --rebase
git push -u origin main
```

## Alternative: Force Push (use with caution)

```bash
# If you want to completely replace the remote repository:
git push -f origin main
```

## Step 7: Verify on GitHub

1. Go to: https://github.com/rafiqahamedk/Self-Evolving-Code-Agent
2. Refresh the page
3. Check that all files are updated

## Common Issues and Solutions

### Issue 1: Authentication Required

**Solution:** Use Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with 'repo' permissions
3. Use token as password when prompted

Or use SSH:
```bash
git remote set-url origin git@github.com:rafiqahamedk/Self-Evolving-Code-Agent.git
```

### Issue 2: Rejected Push

```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Issue 3: Large Files

```bash
# Check file sizes
find . -type f -size +50M

# If you have large files, add to .gitignore:
echo "backend/venv/" >> .gitignore
echo "frontend/node_modules/" >> .gitignore
git rm -r --cached backend/venv
git rm -r --cached frontend/node_modules
git add .gitignore
git commit -m "Remove large files from tracking"
git push origin main
```

## Quick Command Summary

```bash
# Complete workflow
git add .
git commit -m "Update Self-Evolving Code Agent with latest features"
git push origin main
```

## What Will Be Pushed

✅ All backend Python files
✅ All frontend React files
✅ Updated README.md
✅ Configuration files
✅ Documentation files

❌ backend/venv/ (ignored)
❌ frontend/node_modules/ (ignored)
❌ backend/.env (ignored - contains API key)
❌ __pycache__/ (ignored)

## After Pushing

Your repository will have:
- Complete multi-agent system
- Test case support
- Sample input/output fields
- Hidden test validation
- Two-page UI flow
- Failed test display
- All latest improvements
