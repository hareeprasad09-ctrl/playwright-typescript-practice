import { test, expect } from '../fixtures/test';

test.describe('Core task flows', { tag: ['@smoke', '@regression'] }, () => {
  test('opens with a clean task list', async ({ tasksPage }) => {
    await expect(tasksPage.heading).toBeVisible();
    await expect(tasksPage.rows).toHaveCount(0);
    await expect(tasksPage.count).toHaveText('0 active tasks');
  });

  test('adds a task', async ({ tasksPage }) => {
    await tasksPage.addTask('Write my first test');
    await expect(tasksPage.task('Write my first test')).toBeVisible();
    await expect(tasksPage.newTask).toBeEmpty();
    await expect(tasksPage.count).toHaveText('1 active task');
  });

  test('completes a task', async ({ tasksPage }) => {
    await tasksPage.addTask('Run Chromium');
    await tasksPage.complete('Run Chromium');
    await expect(tasksPage.task('Run Chromium').getByRole('checkbox')).toBeChecked();
    await expect(tasksPage.count).toHaveText('0 active tasks');
  });
});
