# Verification

## GitHub Actions — passed

Verified run: https://github.com/hareeprasad09-ctrl/playwright-typescript-practice/actions/runs/36317017160

- Commit: `a8871fb9d77c8bb8a274dcad89b11abad49a7fce`.
- Node.js 22 on the GitHub-hosted Ubuntu runner.
- Dependency and Chromium installation succeeded.
- TypeScript checking passed.
- **11 tests passed (5.5 seconds), Chromium, one worker.**
- No failed tests or retries were reported.
- The job succeeded in 38 seconds and uploaded `playwright-report`.
- CI runs on pushes, pull requests, and manual dispatch. No deployment is configured.

## Earlier local attempt

- Dependencies installed successfully; exact versions and npm lockfile included.
- TypeScript checking passed (`tsc --noEmit`).
- Playwright discovered all 11 Chromium tests in two files.
- Browser installation was attempted but the environment rejected child-process
  creation with `Error: spawn EPERM`.
- The full test run was attempted and also stopped with `Error: spawn EPERM`
  before executing test bodies. Local browser execution remains blocked;
  the hosted run above subsequently verified the browser assertions.

To run locally from a terminal that permits child processes:

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm run test:smoke
npm run test:regression
```
