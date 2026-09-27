import { test as base, expect } from '@playwright/test';
import { TasksPage } from '../pages/TasksPage';

type Fixtures = { tasksPage: TasksPage; seededTasks: TasksPage };

export const test = base.extend<Fixtures>({
  tasksPage: async ({ page }, use) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await use(tasksPage);
    // Playwright closes this test's browser context, including its local storage.
  },
  seededTasks: async ({ tasksPage }, use) => {
    await tasksPage.addTask('Learn locators');
    await tasksPage.addTask('Practice fixtures');
    await tasksPage.complete('Learn locators');
    await use(tasksPage);
  },
});
export { expect };
