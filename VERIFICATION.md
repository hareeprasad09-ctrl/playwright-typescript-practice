# Local verification

- Dependencies installed successfully; exact versions and npm lockfile included.
- TypeScript checking passed (`tsc --noEmit`).
- Playwright discovered all 11 Chromium tests in two files.
- Browser installation was attempted but the environment rejected child-process
  creation with `Error: spawn EPERM`.
- The full test run was attempted and also stopped with `Error: spawn EPERM`
  before executing test bodies. Browser assertions are therefore unverified;
  no passing browser-test result is claimed.
- GitHub Actions is configured but has not been executed on GitHub.

To finish browser verification from a terminal that permits child processes:

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm run test:smoke
npm run test:regression
```
