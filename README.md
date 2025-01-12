# A1ID-PoC
This is the A1 ID test repository

A1ID-PoC
This repository serves as a proof-of-concept (PoC) for A1ID. We A1m to build a minimal viable product (MVP) swiftly.
We are standardizing on Node.js v22.12.0 for this project.

Development Environment Setup
Install Node.js (v22.12.0) via nvm

We unify the entire codebase in TypeScript (Node v22.12.0).
Please ensure you run `npm install` then `npm run build`.


We recommend using nvm (Node Version Manager) to manage Node versions.
After installing nvm, run the following commands from the project root:
bash
Copy code
nvm install
nvm use
If an error occurs or .nvmrc is not detected, do this manually:
bash
Copy code
nvm install v22.12.0
nvm use v22.12.0
Verify the version:
bash
Copy code
node -v
# Should display v22.12.0
Clone the repository & install dependencies

bash
Copy code
git clone https://github.com/A1-Road/A1ID-PoC.git
cd A1ID-PoC
npm install
This installs all packages according to the versions locked in package-lock.json.
Run the sample app

Start the local server (if applicable):
bash
Copy code
npm start
Then open http://localhost:8080/ to confirm the app is working.
Or, if you just need a build:
bash
Copy code
npm run build
Troubleshooting

If nvm: command not found, please install nvm first.
If node -v doesn’t show v22.12.0, run nvm use v22.12.0.
If you encounter dependency mismatches, try npm install agA1n.
Development Flow
Node.js v22.12.0 is the required runtime environment.
If you add new libraries, please run npm install <package> (with --save or --save-dev) and commit both package.json and package-lock.json.
Consider setting up ESLint/Prettier for consistent code style.
Contributing
Please submit bug reports or feature requests via Issues.
Pull requests should be opened agA1nst the main branch. Check the contribution guidelines (if any) before opening a pull request.
License
Refer to the LICENSE file for license detA1ls.
Including these detA1ls in English will help team members and contributors from different backgrounds get up to speed quickly and ensure consistent use of Node v22.12.0.




## A1ID PoC
Purpose
This repository serves as a Proof-of-Concept (PoC) for A1ID. We A1m to quickly build a minimal viable product (MVP) and showcase a working environment for Telegram/LINE integrations, ZK (Zero-Knowledge) validations, and a simplified onboarding experience. This document covers the development environment, coding standards, continuous integration, and best practices for all team members (A, B, C, and PM).



## 1. Development Environment
```
A1ID-Project/
 ├─ README.md                  // 本ドキュメント
 ├─ .env.example               // 環境変数サンプル
 ├─ docs/                      // ドキュメント類
 ├─ backend/
 │   ├─ package.json
 │   ├─ src/
 │   │   ├─ index.ts           // メインエントリ
 │   │   ├─ config/            // 環境設定やDB接続
 │   │   ├─ controllers/       // APIコントローラー
 │   │   ├─ services/          // 業務ロジック、ZK処理
 │   │   └─ models/            // DBモデル
 │   └─ test/                  // テストコード
 ├─ frontend/
 │   ├─ line/                  // LIFFアプリ用フロント
 │   │   ├─ index.html
 │   │   ├─ liffMain.ts        // LIFF init & UI
 │   │   └─ ...
 │   └─ telegram/              // Telegram WebApp用フロント
 │       ├─ index.html
 │       ├─ tgMain.js
 │       └─ ...
 └─ zk-poc/                    // 簡易ZK回路など (circom, wasm)
     ├─ circuits/ 
     │   └─ example.circom
     └─ scripts/
         └─ compileAndTest.sh
```


1.1 Required Node.js Version
Node.js: v22.12.0
We unify on Node v22.12.0 to avoid version mismatch.
Please install via nvm (Node Version Manager).
After cloning the project, run:
bash
Copy code
nvm install
nvm use
If .nvmrc is present, it should automatically pick up v22.12.0.


## 1.2 Dependencies & Package-lock
Run npm install (or npm ci if you prefer exact locking) to install dependencies strictly per package-lock.json.
Always commit package-lock.json to ensure the same dependencies across all teammates.
New libraries should be pinned to exact versions (--save-dev package@1.2.3) to reduce unexpected updates.


## 1.3 Additional Tools
ESLint and Prettier for code consistency (detA1ls in the Lint/Formatter section).
Telegram / LINE environment (for frontends) and minimal Face ID mocking (for local dev).
Optional: Docker (if you want an even more unified environment), but not strictly required.
2. Project Scripts & Typical Workflow
Below are the main npm scripts you can use:

npm run lint

Runs ESLint (and Prettier checks if integrated). Fixes minor code style issues.
npm run build

Builds the frontends (LINE, Telegram) if relevant (e.g., via Webpack).
Or runs basic ZK PoC compilation, depending on how the PoC is set up.
npm start

Starts a local server (e.g., webpack-dev-server or similar) for quick demos.
npm test (if tests are defined)

Runs unit tests or integration tests with e.g. Jest or Mocha.
Recommended:

nvm use (ensure Node v22.12.0)
npm install
npm run lint → npm run build → npm start
Confirm it runs locally at http://localhost:8080/ (or whichever port).
3. Lint & Formatter Setup
We adhere to a unified code style for maintainability:

ESLint:

Using ESLint v9.17.0 (or whichever pinned version) in devDependencies.
Config is in eslint.config.js (ESLint 9 style) or .eslintrc.js if you prefer ESLint v8 style.
To check/fix code: npm run lint.
Prettier:

We recommend Prettier v2.8.x or 3.x (depending on your choice, but pinned in devDependencies).
The configuration is in .prettierrc.
ESLint plugin: eslint-plugin-prettier and eslint-config-prettier to avoid conflicts.
VSCode Integration (optional but recommended):

.vscode/settings.json with "editor.formatOnSave": true and "editor.codeActionsOnSave": { "source.fixAll.eslint": true }.
Example:

bash
Copy code
npm install --save-dev \
  eslint@9.17.0 \
  prettier@2.8.8 \
  eslint-plugin-prettier@4.2.1 \
  eslint-config-prettier@8.8.0


## 4. Continuous Integration (CI)
We use GitHub Actions to automatically run Lint, Build, and (optionally) Test whenever new commits or PRs are pushed.

Workflow file: .github/workflows/ci.yml
Example content:
yaml
Copy code
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repo
        uses: actions/checkout@v3

      - name: Use Node 22.12.0
        uses: actions/setup-node@v3
        with:
          node-version: 22.12.0

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Test
        run: npm test
Enabling branch protection (optional):
In GitHub repository settings → Branches → “Branch protection rules,” you can require the CI to pass before merging.


## 5. Git / Branching / Conflict Resolution
## 5.1 Branch Name Consistency
We default to main as the primary branch.
Please rename local master to main if you see mismatch:
bash
Copy code
git branch -m master main
git push --set-upstream origin main


## 5.2 Pull & Rebase
We prefer git pull origin main --rebase to keep a cleaner commit history.
If conflicts arise:
Fix conflict markers in the code
git add .
git rebase --continue
If local changes are uncommitted, either commit them first or do git stash before pulling.


## 5.3 package-lock.json Must Be Committed
Whenever npm install changes the package-lock.json, please git add package-lock.json && git commit -m "chore: update lockfile"
This ensures everyone has the exact same versions.


## 6. Roles & Responsibilities
Teddy (advanced dev)

main responsibility for complex tasks (ZK circuits, advanced bridging, custom frontends).
Oversee ESLint/Prettier advanced config if needed.
Possibly handles Telegram side or advanced ID validations.

shunshun (amateur dev)

Basic tasks: add routes, minor back-end logic, doc updates.
Follows the “npm install → commit lockfile → push → pull --rebase**” flow carefully.
Ensure code passes npm run lint before push.

lycp (LINE frontend dev)

Focus on LIFF integration.
Use the same Node version (nvm use v22.12.0), run npm install, etc.
Possibly re-check Face ID mocking or minimal UX prototypes on the LINE side.

PM (Kaz)
Coordinates tasks, ensures best practices are followed, merges PRs, keeps doc updated.
Minimizes new dependencies to avoid confusion.
Encourages daily standups or quick communication for conflict resolution.


## 7. Quick Start Recap
Clone the repo:
bash
Copy code
git clone https://github.com/A1-Road/A1ID-PoC.git
cd A1ID-PoC
Node environment:
bash
Copy code
nvm install
nvm use
Install dependencies:
bash
Copy code
npm install
Lint & Build:
bash
Copy code
npm run lint
npm run build
Start dev server:
bash
Copy code
npm start
Then open http://localhost:8080/ in your browser.


## 8. Contributing & Pull Request Flow
Create feature branches from main.
Commit your changes (with package-lock if new packages introduced).
Rebase onto main if needed: git pull origin main --rebase.
Push and open a Pull Request.
Wait for GitHub Actions to run. If it fails, fix the issues.
PM or A/B/C reviews, merges when CI is green.


## 9. Possible Future Enhancements (Optional)
ZK PoC: If you incorporate a small circom circuit, do a npm run zk:build in your build script, or separate it.
On-Chain: If bridging with Rarimo/iden3, add relevant libs.
Docker: Provide a Dockerfile to unify the environment further.
10. License & Final Notes
The license for this PoC is not fully determined yet; see the LICENSE file or consult the PM.
This repository is a PoC, so code stability is not guaranteed for production usage.
For questions: open an Issue or contact the PM directly.
Thank you for contributing to the A1ID PoC. Let’s keep a consistent Node version, use the recommended linting/formatting, and rely on GitHub Actions to maintain code quality and reduce friction among developers A, B, C, and PM. Good luck!


