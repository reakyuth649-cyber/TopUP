# lisa-topup-clone

Small Next.js project. This README explains how to initialize git and push to GitHub from Windows PowerShell.

Quick steps (PowerShell):

1. Initialize git (if not already):

```powershell
cd "d:\SETEC មេរៀន Year2\TopUP"
git init
git add .
git commit -m "chore: initial commit"
```

2. Create a GitHub repository and push:

- Option A — using GitHub CLI (recommended):

```powershell
gh repo create <your-username>/<repo-name> --public --source=. --remote=origin --push
```

- Option B — manual: create a repo on github.com, then run:

```powershell
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

Notes:
- Install Git for Windows: https://git-scm.com/download/win
- (Optional) Install GitHub CLI: https://cli.github.com/
lisa-topup-clone
To install dependencies:

bun install
To run:

bun run index.ts
This project was created using bun init in bun v1.2.17. Bun is a fast all-in-one JavaScript runtime.