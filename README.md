# Playwright TypeScript practice

A self-contained Task Lab app with a page object model (POM), typed test fixtures,
three smoke tests, eight additional regression tests, and GitHub Actions.
All tests use Chromium and one worker. No account or external test website is required.

[![Playwright tests](https://github.com/hareeprasad09-ctrl/playwright-typescript-practice/actions/workflows/playwright.yml/badge.svg)](https://github.com/hareeprasad09-ctrl/playwright-typescript-practice/actions/workflows/playwright.yml)

Verified on GitHub Actions: **11 tests passed** with Chromium and one worker.
[View the successful run](https://github.com/hareeprasad09-ctrl/playwright-typescript-practice/actions/runs/36317017160).

## Start here

Install Node.js 22 or newer, open a terminal in this directory, then run:

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

Playwright automatically starts and stops the local app on port 4173. Leave that
port free before running tests. To explore the app manually, run `npm start` and
open http://127.0.0.1:4173; stop it before running the suite.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | All 11 tests |
| `npm run test:smoke` | Three critical flows tagged `@smoke` |
| `npm run test:regression` | Full regression, including smoke tests |
| `npm run test:headed` | Watch Chromium execute the suite |
| `npm run test:debug` | Step through using Playwright Inspector |
| `npm run typecheck` | Check TypeScript without emitting JavaScript |
| `npm run report` | Open the most recent HTML report |

## How the project fits together

```text
app/                         Local demo app and dependency-free Node server
pages/TasksPage.ts            Locators and reusable user actions
fixtures/test.ts             Typed tasksPage and seededTasks fixtures
tests/smoke.spec.ts           Open, add, and complete a task
tests/regression.spec.ts      Filters, reload, reopen, delete, clear, validation
playwright.config.ts         Chromium, one worker, server, diagnostics
.github/workflows/playwright.yml  Install, type-check, test, upload report
```

Tests import `test` and `expect` from `fixtures/test.ts`. The `tasksPage` fixture
opens the app; `seededTasks` builds on it by adding two tasks and completing one.
Playwright creates and disposes a fresh browser context for every test, isolating
local storage without shared cleanup or test ordering dependencies.

Page objects own locators and actions; tests own expected outcomes. Locators use
accessible roles and labels. Assertions auto-retry; there are no fixed sleeps.
The `task(title)` helper expects a unique title, so use distinct titles when
practicing with that helper.

Failed tests retain traces, screenshots, and videos in `test-results/`.
The HTML report lives in `playwright-report/`. CI permits one retry and rejects
accidental `test.only`; local runs have no retries so failures remain visible.

## Practice exercises

1. Add a test for submitting a task with the Enter key.
2. Verify the empty-state message when the Completed filter has no matches.
3. Add task editing to the app, a page-object action, and a regression test.
4. Add duplicate-title coverage and update the page object to select by row.
5. Deliberately break a behavior, run the relevant test, and inspect its trace.

## GitHub Actions

Publish **the contents of this directory as the repository root**, including
`.github/` and `package-lock.json`. The workflow runs on pushes, pull requests,
and manual dispatch. It installs Chromium with Linux system dependencies, checks
types, runs the full regression suite, and uploads reports for 14 days.
The workflow is published and its first hosted run passed all 11 tests. This is
continuous integration (CI); automatic deployment (CD) is not configured.

## References

- [Playwright fixtures](https://playwright.dev/docs/test-fixtures)
- [Page object models](https://playwright.dev/docs/pom)
- [Continuous integration](https://playwright.dev/docs/ci)
- [Workers and parallelism](https://playwright.dev/docs/test-parallel)

## Explain this project in an interview

Use these sample answers as study notes. Describe it as a practice project, and
only claim work and results you can personally explain or demonstrate.

### Your 60-second project introduction

> This is a Playwright TypeScript practice project for a local task-management
> application. It has 11 browser tests: three smoke tests for opening the app,
> adding a task, and completing a task, plus eight additional regression tests.
> I organized locators and reusable actions in a page object, and setup in typed
> fixtures. Each test uses an isolated browser context. The configuration runs
> Chromium with one worker and captures diagnostics for failures. A GitHub
> Actions workflow installs dependencies, checks TypeScript, runs regression,
> and uploads reports. The hosted GitHub Actions run passed all 11 tests with
> Chromium and one worker. Local browser execution was blocked by a process-permission error.

### Read the files in this order

1. `package.json`: understand the commands and dependencies.
2. `playwright.config.ts`: understand browser, worker, server, and reporting settings.
3. `pages/TasksPage.ts`: follow the locators and user actions.
4. `fixtures/test.ts`: follow page-object creation and optional seeded data.
5. `tests/smoke.spec.ts`: understand the simplest test scenarios.
6. `tests/regression.spec.ts`: study broader behavior and boundary checks.
7. `.github/workflows/playwright.yml`: trace the CI steps.

## Walk through one test

This example uses the same pattern as the project's smoke tests:

```ts
import { test, expect } from '../fixtures/test';

test('adds a task', async ({ tasksPage }) => {
  await tasksPage.addTask('Write my first test');
  await expect(tasksPage.task('Write my first test')).toBeVisible();
  await expect(tasksPage.count).toHaveText('1 active task');
});
```

Execution flow:

1. Playwright loads the configuration and starts the local app.
2. The test requests `tasksPage` from our extended `test` object.
3. That fixture requests Playwright's built-in `page` fixture.
4. The fixture constructs `TasksPage`, opens `/`, and passes it to the test with `use`.
5. `addTask` fills the input and clicks the Add task button.
6. The assertions check the task and active count, retrying until they pass or time out.
7. After the test, Playwright disposes its context. Its local storage is not shared with the next test.

## Interview questions and sample answers

### 1. What is Playwright?

Playwright is a browser automation tool. This project uses Playwright Test as the
test runner, with browser fixtures, assertions, configuration, and reports. Here,
it drives Chromium against a local application to check user-visible behavior.

### 2. Why did you use TypeScript?

TypeScript checks types before execution. In this project, it checks page-object
methods and fixture types, and limits `filterBy` to `All`, `Active`, or `Completed`.
It helps catch mistakes during development, but it does not replace runtime tests.
Playwright runs TypeScript tests; a separate `tsc --noEmit` command checks types.

### 3. What is the Page Object Model, or POM?

POM groups a page's locators and reusable interactions in a class. `TasksPage`
contains actions such as `addTask`, `complete`, `remove`, and `filterBy`. Tests
express the scenario and expected outcome. If a locator changes, I can update
the page object instead of editing many tests.

### 4. Why are assertions in the tests?

In this project, actions belong to the page object and scenario expectations
belong to tests. That makes the expected behavior easy to review. This is a
design choice, not a rule that page objects can never contain assertions.

### 5. What is a fixture?

A fixture supplies a test with a resource or prepared state and manages its
lifecycle. Our `tasksPage` fixture opens the app and supplies a page object.
`seededTasks` depends on it, creates two tasks, completes one, and then supplies
that prepared page object to the test.

### 6. What does `await use(tasksPage)` do?

It makes the prepared value available to the consuming test or dependent fixture.
Setup happens before `use`; any custom teardown would go after it. We do not need
manual browser cleanup here because Playwright owns the built-in page and context.

### 7. How are fixtures different from `beforeEach`?

`beforeEach` is a hook for setup before tests in its scope. Fixtures are named,
typed dependencies that tests can request and other fixtures can build on.
We use fixtures so ordinary tests request `tasksPage`, while tests needing sample
data request `seededTasks`. Either approach can be appropriate for simple setup.

### 8. What is the difference between smoke and regression testing?

Smoke testing checks a small set of critical flows to see whether the application
is usable enough for further testing. Regression testing checks a broader set of
existing behaviors after changes. Here, smoke tests have both `@smoke` and
`@regression` tags, so regression includes all 11 tests rather than just eight.

### 9. How do you run a particular suite or test?

```sh
npm run test:smoke
npm run test:regression
npx playwright test tests/regression.spec.ts
npx playwright test --grep "persists task text"
```

The npm scripts select tags using `--grep`. Selecting a file or title is useful
while developing or investigating one scenario.

### 10. Why use role-based locators?

Locators such as `getByRole('button', { name: 'Add task', exact: true })` describe
the element by its role and accessible name. They are easier to understand and
less coupled to layout than a long CSS path. Stable test IDs can be useful when
there is no suitable user-facing locator. Role locators alone do not constitute
a complete accessibility test.

### 11. What does auto-waiting mean?

Before actions such as clicking, Playwright checks the relevant actionability
conditions. Locator assertions such as `toBeVisible` retry until the expected
condition is met or the assertion times out. This reduces the need for fixed
delays. Auto-waiting does not know every business condition, so tests still need
explicit assertions for the outcomes they care about.

### 12. Why avoid `waitForTimeout`?

A fixed delay can be too short on a slow machine and wasteful on a fast one.
Waiting for a visible result or a relevant event ties the test to actual behavior.
This suite uses awaited actions and retrying assertions instead of sleeps.

### 13. Why do the tests use `async` and `await`?

Browser actions and assertions are asynchronous. `await` ensures the current
operation finishes before the next dependent step runs. Missing an `await` can
cause races or leave work running after the test finishes.

### 14. How do you keep tests independent?

Each test receives its own browser context. This application stores tasks in
local storage, so the context boundary isolates its data. Tests create their own
required tasks and do not depend on another test running first. For a real
backend, context isolation would not reset database records; I would also need
isolated server-side test data and cleanup.

### 15. What are browser, context, and page?

The browser is the running browser instance. A context is an isolated session
inside it, with its own cookies and storage. A page is a tab within a context.
The built-in fixtures manage these resources so tests do not manually launch
and close the browser.

### 16. Why Chromium and one worker?

Those were the project requirements. `projects` contains only Chromium and
`workers: 1` limits test execution to one worker at a time. This keeps practice
runs straightforward, but it is slower than parallel execution and does not
provide Firefox or WebKit coverage. One worker does not mean tests share state.

### 17. How do retries work here?

Local tests have zero retries. CI allows one retry after a failure. A test that
passes on retry is evidence of flakiness to investigate, not proof that the
underlying issue is fixed. Retries can help collect evidence, but should not
replace fixing unstable tests or application behavior.

### 18. How would you debug a failed test?

First, read the failed assertion and distinguish a setup error from a browser
test failure. Reproduce the smallest relevant test, inspect the HTML report,
and review the trace, screenshot, or video when available. Check the locator,
test data, application state, and expected behavior. Fix the cause, rerun the
affected test, then run the relevant regression suite.

```sh
npm run report
npx playwright test --grep "adds a task" --headed
npx playwright test --grep "adds a task" --debug
```

### 19. What does GitHub Actions do in this project?

On a push, pull request, or manual dispatch, the workflow checks out the code,
sets up Node.js 22, runs `npm ci`, installs Chromium and Linux dependencies,
checks TypeScript, and runs regression. It uploads reports and test artifacts
unless the job is cancelled. The one-worker Chromium configuration also applies
in CI. The first hosted run succeeded, including all 11 tests and report upload.

### 20. Why use `npm ci` in CI?

It installs dependencies from the committed lockfile and fails if the manifest
and lockfile are inconsistent. This makes dependency installation reproducible.
The project includes exact dependency versions and `package-lock.json`.

### 21. How is the application started?

The `webServer` configuration runs `npm run start` and waits for the configured
URL. The app is served at `http://127.0.0.1:4173`. With `baseURL` configured,
`page.goto('/')` opens that address. Existing-server reuse is disabled so a test
run does not accidentally use some other app already listening on the port.

### 22. What test-design techniques are demonstrated?

There are positive flows, negative validation, state transitions, persistence,
and boundary checks. For example, the length test rejects 81 characters and
accepts 80; the whitespace test rejects blank input; the reopen test changes a
completed task back to active. Reload tests check that saved state persists.

### 23. What limitations would you improve next?

The project covers one small page and one browser. It has no real backend,
authentication, API test suite, or cross-browser checks. The title-based row
helper assumes unique titles. I would add duplicate-title coverage, improve row
selection for that case, and introduce additional scenarios based on product
risk. The hosted Chromium suite has passed; local execution still needs an environment that permits browser child processes.

### 24. What challenge did you encounter, and how did you handle it?

> Dependency installation initially failed because network access was restricted.
> After network access was granted, installation succeeded. Chromium installation
> and test execution then failed with `spawn EPERM`, before any test bodies ran.
> Type checking passed and Playwright discovered all 11 tests. I documented the
> local blocker, then published the project to GitHub and verified its CI run.
> All 11 browser tests passed on the GitHub-hosted runner.

The local failure was an environment setup issue, not a demonstrated application defect.
The later hosted run executed the assertions successfully; no assertion fixes were needed.

## Quick revision sheet

| Topic | Answer to remember |
| --- | --- |
| POM | Centralizes locators and reusable page actions |
| Fixtures | Provide typed setup, dependencies, and lifecycle management |
| Smoke | Three critical-flow tests |
| Regression | All 11 tests, including smoke |
| Isolation | Fresh context per test; local storage stays separate |
| Locators | Roles and accessible names; exact matching where appropriate |
| Waiting | Await actions and use retrying assertions |
| Execution | Chromium only, one worker |
| Diagnostics | HTML report plus retained failure artifacts |
| CI | Install, type-check, run regression, upload artifacts |
| Verification | Hosted CI passed all 11 tests; local browser execution blocked |

Before an interview, practice explaining one test from fixture setup through
assertion and teardown. Then make one small change yourself and explain why it
works. Understanding that flow is more useful than memorizing every answer.
