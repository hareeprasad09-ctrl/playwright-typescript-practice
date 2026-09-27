import { type Locator, type Page } from '@playwright/test';

export class TasksPage {
  readonly heading: Locator;
  readonly newTask: Locator;
  readonly rows: Locator;
  readonly error: Locator;
  readonly count: Locator;
  readonly clearCompleted: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Task Lab' });
    this.newTask = page.getByRole('textbox', { name: 'New task' });
    this.rows = page.getByRole('list', { name: 'Tasks' }).getByRole('listitem');
    this.error = page.getByRole('alert');
    this.count = page.getByRole('status');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed', exact: true });
  }

  async goto() { await this.page.goto('/'); }
  async addTask(title: string) {
    await this.newTask.fill(title);
    await this.page.getByRole('button', { name: 'Add task', exact: true }).click();
  }
  task(title: string) {
    return this.rows.filter({ has: this.page.getByText(title, { exact: true }) });
  }
  async complete(title: string, completed = true) {
    await this.task(title).getByRole('checkbox').setChecked(completed);
  }
  async remove(title: string) { await this.task(title).getByRole('button').click(); }
  async filterBy(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('button', { name: filter, exact: true }).click();
  }
}
