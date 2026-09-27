import { test, expect } from '../fixtures/test';

test.describe('Task behavior', { tag: '@regression' }, () => {
  test('filters active and completed tasks', async ({ seededTasks: tasks }) => {
    await tasks.filterBy('Active');
    await expect(tasks.rows).toHaveCount(1);
    await expect(tasks.task('Practice fixtures')).toBeVisible();
    await tasks.filterBy('Completed');
    await expect(tasks.rows).toHaveCount(1);
    await expect(tasks.task('Learn locators')).toBeVisible();
    await tasks.filterBy('All');
    await expect(tasks.rows).toHaveCount(2);
  });

  test('persists task text and completion after reload', async ({ seededTasks: tasks }) => {
    await tasks.page.reload();
    await expect(tasks.rows).toHaveCount(2);
    await expect(tasks.task('Learn locators').getByRole('checkbox')).toBeChecked();
    await expect(tasks.task('Practice fixtures').getByRole('checkbox')).not.toBeChecked();
  });

  test('reopens a completed task', async ({ seededTasks: tasks }) => {
    await tasks.complete('Learn locators', false);
    await expect(tasks.count).toHaveText('2 active tasks');
    await expect(tasks.task('Learn locators').getByRole('checkbox')).not.toBeChecked();
  });

  test('deletes only the selected task and persists deletion', async ({ seededTasks: tasks }) => {
    await tasks.remove('Practice fixtures');
    await tasks.page.reload();
    await expect(tasks.rows).toHaveCount(1);
    await expect(tasks.task('Learn locators')).toBeVisible();
    await expect(tasks.count).toHaveText('0 active tasks');
  });

  test('clears only completed tasks', async ({ seededTasks: tasks }) => {
    await tasks.clearCompleted.click();
    await expect(tasks.rows).toHaveCount(1);
    await expect(tasks.task('Practice fixtures')).toBeVisible();
    await expect(tasks.clearCompleted).toBeDisabled();
  });

  test('rejects whitespace and recovers after valid input', async ({ tasksPage: tasks }) => {
    await tasks.addTask('   ');
    await expect(tasks.error).toHaveText('Enter a task.');
    await expect(tasks.rows).toHaveCount(0);
    await tasks.addTask('  Valid task  ');
    await expect(tasks.task('Valid task')).toBeVisible();
    await expect(tasks.error).toBeHidden();
  });

  test('accepts 80 characters and rejects 81', async ({ tasksPage: tasks }) => {
    await tasks.addTask('a'.repeat(81));
    await expect(tasks.error).toHaveText('Use 80 characters or fewer.');
    await expect(tasks.rows).toHaveCount(0);
    await tasks.addTask('a'.repeat(80));
    await expect(tasks.rows).toHaveCount(1);
    await expect(tasks.error).toBeHidden();
  });

  test('renders markup as literal task text', async ({ tasksPage: tasks }) => {
    const title = '<b>Practice safely</b>';
    await tasks.addTask(title);
    await expect(tasks.task(title)).toBeVisible();
    await expect(tasks.rows.locator('b')).toHaveCount(0);
  });
});
