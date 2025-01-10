# A1ID-PoC
This is the A1 ID test repository

A1ID-PoC
This repository serves as a proof-of-concept (PoC) for A1ID. We aim to build a minimal viable product (MVP) swiftly.
We are standardizing on Node.js v22.12.0 for this project.

Development Environment Setup
Install Node.js (v22.12.0) via nvm

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
git clone https://github.com/AI-Road/AIID-PoC.git
cd AIID-PoC
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
If you encounter dependency mismatches, try npm install again.
Development Flow
Node.js v22.12.0 is the required runtime environment.
If you add new libraries, please run npm install <package> (with --save or --save-dev) and commit both package.json and package-lock.json.
Consider setting up ESLint/Prettier for consistent code style.
Contributing
Please submit bug reports or feature requests via Issues.
Pull requests should be opened against the main branch. Check the contribution guidelines (if any) before opening a pull request.
License
Refer to the LICENSE file for license details.
Including these details in English will help team members and contributors from different backgrounds get up to speed quickly and ensure consistent use of Node v22.12.0.






