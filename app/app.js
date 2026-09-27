const storageKey = 'task-lab.tasks';
let tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
let filter = 'All';
const list = document.querySelector('#tasks');
const input = document.querySelector('#task-input');
const error = document.querySelector('#error');

function render() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
  list.replaceChildren();
  const visible = tasks.filter(task => filter === 'All' || (filter === 'Completed' ? task.completed : !task.completed));
  for (const task of visible) {
    const row = document.createElement('li');
    row.dataset.completed = String(task.completed);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Complete ${task.title}`);
    checkbox.addEventListener('change', () => { task.completed = checkbox.checked; render(); });
    const title = document.createElement('span');
    title.textContent = task.title;
    const remove = document.createElement('button');
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${task.title}`);
    remove.addEventListener('click', () => { tasks = tasks.filter(item => item.id !== task.id); render(); });
    row.append(checkbox, title, remove);
    list.append(row);
  }
  document.querySelector('#empty').hidden = visible.length > 0;
  const remaining = tasks.filter(task => !task.completed).length;
  document.querySelector('#count').textContent = `${remaining} active task${remaining === 1 ? '' : 's'}`;
  document.querySelector('#clear').disabled = !tasks.some(task => task.completed);
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
}
document.querySelector('#task-form').addEventListener('submit', event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title || title.length > 80) {
    error.textContent = !title ? 'Enter a task.' : 'Use 80 characters or fewer.';
    error.hidden = false;
    return;
  }
  tasks.push({ id: crypto.randomUUID(), title, completed: false });
  input.value = '';
  error.hidden = true;
  render();
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; render(); }));
document.querySelector('#clear').addEventListener('click', () => { tasks = tasks.filter(task => !task.completed); render(); });
render();
