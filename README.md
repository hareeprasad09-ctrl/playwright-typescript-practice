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

The project is published at [hareeprasad09-ctrl/playwright-typescript-practice](https://github.com/hareeprasad09-ctrl/playwright-typescript-practice).
The workflow runs on pushes, pull requests,
and manual dispatch. It installs Chromium with Linux system dependencies, checks
types, runs the full regression suite, and uploads reports for 14 days.
The workflow is published and its first hosted run passed all 11 tests. This is
continuous integration (CI); automatic deployment (CD) is not configured.

## How to run this project in CI — and where it runs

### Does it run in the cloud?

**Yes.** The workflow uses `runs-on: ubuntu-latest`, which requests a
GitHub-hosted Ubuntu runner: a temporary cloud virtual machine for this job.
Your laptop does not execute the CI tests and does not need to stay on after
GitHub receives the commit or manual run request.

```text
You push code or click Run workflow
                 |
           GitHub Actions
                 |
    Temporary Ubuntu cloud runner
    - checks out your repository
    - installs Node.js and npm packages
    - installs Chromium and system dependencies
    - starts Task Lab on 127.0.0.1:4173
    - runs 11 tests with one worker
    - uploads the HTML report
                 |
    Job ends; temporary runner is discarded
```

The app and Chromium run on the **same cloud runner**. `127.0.0.1` refers to
that runner during CI; when you run locally, it refers to your own machine.
Starting the app for tests does not publish it as a permanent public website.
There is no deployed application URL or CD job in this project.

### Option A: Start a run manually in GitHub

1. Open [the Playwright workflow](https://github.com/hareeprasad09-ctrl/playwright-typescript-practice/actions/workflows/playwright.yml)
   while signed in with access to run workflows.
2. Select **Run workflow**.
3. Select the **main** branch, then confirm **Run workflow**.
4. Open the new run when it appears in the list.
5. Open the **test** job to see installation, type checking, and test execution.

The `workflow_dispatch` entry in the YAML enables this manual option. If the
button is missing, confirm that you are signed in with repository write access
and that the workflow exists on the default branch.

### Option B: Run automatically after changing code

Commit and push a code change to the repository. The `push` trigger starts CI.
Creating or updating a pull request also starts a run through `pull_request`.
You can edit a file in GitHub's web editor and commit it, or use a local clone:

```sh
# After editing a test in your authenticated local clone:
git add tests/smoke.spec.ts
git commit -m "Improve smoke coverage"
git push
```

Only commit intended source changes. `node_modules`, reports, and test outputs
are excluded by `.gitignore`. A commit message containing `[skip ci]` skips the
push/pull-request workflow; the documentation-only result update used this to
avoid repeating unchanged tests. You can still start a manual run when needed.

### Read results and download the report

1. Open [Actions](https://github.com/hareeprasad09-ctrl/playwright-typescript-practice/actions).
2. Select the run for your intended branch and commit.
3. Open the **test** job and expand **Run npm run test:regression**.
4. Look for `Running 11 tests using 1 worker` and the pass/fail summary.
5. Return to the run summary and download **playwright-report** under Artifacts.
6. Extract the ZIP. From the project terminal, run:

```sh
npx playwright show-report "path/to/extracted/playwright-report"
```

Replace the quoted path with the real extracted report directory. On a failed
test run, retained traces, screenshots, and videos may also be in the artifact.
An installation or server-startup failure can occur before browser artifacts
exist. Artifacts are retained for 14 days by this workflow.

### What to do when CI is red

Read the first failed step. A failure in `npm ci` is different from a failed
assertion in the regression step. Inspect the logs and available report, fix the
cause, commit the fix, and push it to start a new run. For a confirmed transient
infrastructure issue, GitHub's run menu can rerun jobs; rerunning does not itself
fix application or test code.

### Interview answer: Where does your automation execute?

> My tests run in GitHub Actions on a GitHub-hosted Ubuntu cloud runner. The
> workflow checks out the repository, installs Node.js and Chromium, and starts
> the practice app locally on that runner. Chromium executes the smoke and
> regression suite with one worker, and the workflow uploads an HTML report.
> Runs start on pushes, pull requests, or manually through workflow_dispatch.
> This is CI automation; it does not deploy the app to a public environment.

## Official learning references

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

## Framework architecture to explain on a whiteboard

```text
GitHub push / pull request / manual run
                    |
          .github/workflows/playwright.yml
                    |
       install -> typecheck -> regression -> report
                    |
          playwright.config.ts
          /                  \
   local app server     Chromium / 1 worker
                              |
                  smoke and regression specs
                              |
                  fixtures/test.ts
                  /             \
           tasksPage        seededTasks
                  \             /
                     TasksPage
                         |
                browser page -> Task Lab
```

Sample explanation: “The workflow controls the CI steps. Playwright configuration
controls browser execution and the local server. Tests request fixtures, fixtures
provide page objects and data, and page objects interact with the application.
Assertions in the tests verify the expected business behavior.”

## Configuration values you should know

| Setting | This project | Explain the reason |
| --- | --- | --- |
| `testDir` | `./tests` | Keeps test discovery scoped to the specs |
| `workers` | `1` | Runs one test worker at a time, as required |
| `fullyParallel` | `false` | Does not opt all tests into full parallelism |
| `projects` | Chromium only | Defines the browser under test |
| `timeout` | 30 seconds | Default timeout for an individual test |
| `expect.timeout` | 5 seconds | Default timeout for retrying assertions |
| `retries` | 0 locally, 1 in CI | Makes local failures visible; permits one CI retry |
| `forbidOnly` | Enabled in CI | Rejects accidentally committed focused tests |
| `baseURL` | `http://127.0.0.1:4173` | Allows relative navigation such as `goto('/')` |
| `webServer.timeout` | 30 seconds | Limits waiting for the app server to become ready |
| `reuseExistingServer` | `false` | Requires this run to start its configured app |
| `trace` and `video` | `retain-on-failure` | Keeps these artifacts for failed attempts |
| `screenshot` | `only-on-failure` | Captures screenshots when a test fails |
| Reporters | List and HTML | Console progress plus a browsable report |

These are different timeout settings: increasing an assertion timeout does not
increase the overall test timeout. Investigate the failed condition before
increasing a timeout.

## Actual test coverage to discuss

| Suite | Scenario | What it checks |
| --- | --- | --- |
| Smoke + regression | Open the app | Heading, empty list, zero active count |
| Smoke + regression | Add a task | Task appears, input clears, active count increases |
| Smoke + regression | Complete a task | Checkbox checked and active count decreases |
| Regression | Filters | Active, Completed, and All show the expected rows |
| Regression | Reload | Titles and completion state persist |
| Regression | Reopen | A completed task becomes active again |
| Regression | Delete | Only the selected task is removed; deletion survives reload |
| Regression | Clear completed | Active task remains and clear button becomes disabled |
| Regression | Whitespace | Blank input rejected; trimmed valid input accepted |
| Regression | Length boundary | 81 characters rejected; 80 accepted |
| Regression | Literal markup | Markup displayed as text rather than a `<b>` element |

The markup test checks one rendering behavior. It is not a comprehensive security
assessment. Likewise, 11 passing tests demonstrate these scenarios, not complete
coverage of every possible behavior.

## More interview questions: implementation and scenarios

### 25. Which TypeScript concepts can you demonstrate in this code?

- `class TasksPage` groups related state and behavior.
- `Locator` and `Page` annotate the Playwright objects.
- `constructor(readonly page: Page)` declares and initializes a property.
- `readonly` prevents reassignment through that property; it does not make the browser immutable.
- `base.extend<Fixtures>` supplies fixture types to the extended test object.
- `'All' | 'Active' | 'Completed'` is a union of allowed filter strings.
- `async` methods return promises; tests await their completion.

### 26. What does `async ({ seededTasks: tasks })` mean?

It destructures the fixture argument and renames `seededTasks` to the local
variable `tasks`. It still requests the same fixture. The shorter local name
does not create another fixture or another browser session.

### 27. What is a locator strictness failure?

An action that requires one element can fail if its locator matches multiple
elements. In this project, two identical task titles could make `task(title)`
ambiguous. I would inspect the matches and scope the locator using a meaningful
row identifier. I would not automatically add `.first()` unless choosing the
first item is actually the scenario's requirement.

### 28. A test passes locally but fails in CI. What do you investigate?

I compare the commit, dependency lockfile, browser installation, environment,
test data, and server startup. Then I inspect the failing assertion and retained
artifacts. Timing assumptions, shared data, and environment differences are
possible causes; I need evidence to choose among them. Repeated retries or
larger timeouts alone would not explain the failure.

### 29. How would you add a new test?

Choose a behavior and its expected result, use an existing fixture, and add a
page-object action only if needed. Keep the test independent, tag it appropriately,
and run type checking and the relevant suite. For example, an additional empty
Completed-filter scenario could be:

```ts
// Proposed exercise; this example is not one of the current 11 tests.
import { test, expect } from '../fixtures/test';

test('completed filter is empty for an active task',
  { tag: '@regression' }, async ({ tasksPage }) => {
    await tasksPage.addTask('Prepare interview');
    await tasksPage.filterBy('Completed');
    await expect(tasksPage.rows).toHaveCount(0);
    await expect(tasksPage.page.getByText('No tasks to show.', { exact: true }))
      .toBeVisible();
  });
```

### 30. Does this framework use data-driven testing?

The current tests use inline data and one reusable seeded-data fixture. There is
no external JSON, CSV, or Excel data provider. For many similar validation cases,
I could parameterize tests from a typed array, give each case a unique name, and
keep the data close to the behavior it describes.

### 31. What would change for a real application with authentication?

This app has no login. For a real application, I would design authorized test
accounts, session setup, and isolated server-side test data. I would keep secrets
out of the repository. That would be additional work, not a feature already
implemented in this practice project.

### 32. What is the difference between CI, continuous delivery, and deployment?

CI validates changes through automated checks. Continuous delivery prepares
validated changes for release, often with an approval step. Continuous deployment
automatically releases validated changes. This project implements CI testing and
reporting; it has no release or deployment job.

### 33. Does a failed workflow prevent merging automatically?

A failed workflow reports a failed check. Requiring that check before merging
needs a repository ruleset or branch protection setting. No such merge requirement
was configured as part of this project, so I would not claim that merges are blocked.

### 34. What results can you prove?

The linked GitHub Actions run executed 11 tests using one worker, and all passed
in Chromium. The test execution took 5.5 seconds; the test job took 38 seconds,
and the run summary showed 41 seconds overall. Type checking and report upload
also succeeded. Those are measurements from one run, not performance guarantees.

## Explain the challenge using STAR

Use this as a factual project story; adapt the wording to your own involvement.

- **Situation:** A small Playwright practice framework needed working automated checks.
- **Task:** Run smoke and regression scenarios in Chromium with one worker and publish CI.
- **Action:** Organize POM and fixtures, check TypeScript and test discovery, investigate
  the local `spawn EPERM` setup failure, then publish the project and execute it on
  a GitHub-hosted runner.
- **Result:** All 11 tests passed in hosted CI and the report was uploaded. The local
  process restriction remained documented; it was not presented as a fixed test defect.

If asked about a flaky test you fixed, do not invent one. Explain how you would
investigate flakiness and state that this verified run did not report retries.

## Five-minute interview demo

1. Open the repository and explain its purpose in 30 seconds.
2. Show `TasksPage.ts`: point to one locator and the `addTask` action.
3. Show `fixtures/test.ts`: explain setup, `use`, fixture dependency, and isolation.
4. Show one smoke test and one boundary or persistence regression test.
5. Show Chromium, `workers: 1`, and diagnostic settings in the configuration.
6. Open the successful Actions run, expand `Run npm run test:regression`, and show
   `Running 11 tests using 1 worker` and `11 passed`.
7. Explain one limitation and the next improvement you would implement.

To demonstrate locally on a machine that permits browser processes:

```sh
git clone https://github.com/hareeprasad09-ctrl/playwright-typescript-practice.git
cd playwright-typescript-practice
npm ci
npx playwright install chromium
npm run typecheck
npm run test:smoke
npm run test:regression
npm run report
```

To inspect the CI report, open the successful run's summary and download the
`playwright-report` artifact while it is retained. Extract it and open the report
with `npx playwright show-report <path-to-extracted-playwright-report-folder>`.
The workflow retains artifacts for 14 days, so an older run's download may expire.

## Resume or portfolio wording

After you can explain and demonstrate the implementation, adapt this description:

> Playwright TypeScript practice project: organized browser tests using page
> objects and typed fixtures; implemented smoke and regression coverage for a
> task-list app; configured Chromium with one worker and GitHub Actions for
> type checking, automated tests, and HTML reports. Verified all 11 tests passing
> on a GitHub-hosted runner.

Keep it under personal projects. Do not describe it as production experience,
cross-browser coverage, API automation, or a deployment pipeline.

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
