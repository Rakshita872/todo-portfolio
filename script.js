// ── STATE ───
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let filter = 'all';

// ── SAVE TO LOCALSTORAGE ───
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ── ADD A TASK ───
function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();

  if (!text) return; // do nothing if empty

  tasks.unshift({
    id: Date.now(), // unique ID using timestamp
    text: text,
    done: false
  });

  saveTasks();
  render();

  input.value = '';  // clear input
  input.focus();     // keep focus on input
}

// ── TOGGLE DONE / UNDONE ────
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    render();
  }
}

// ── DELETE A TASK ───
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

// ── CLEAR ALL COMPLETED TASKS ────
function clearDone() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
}

// ── SET FILTER (all / active / done) ────
function setFilter(f, btn) {
  filter = f;
  // remove active class from all buttons
  document.querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));
  // add active class to clicked button
  btn.classList.add('active');
  render();
}

// ── ESCAPE HTML (security) ─────
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── RENDER EVERYTHING ────
function render() {
  const list  = document.getElementById('todoList');
  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;

  // Update progress bar
  const percent = total ? (done / total * 100) : 0;
  document.getElementById('progressBar').style.width = percent + '%';

  // Update stats text
  document.getElementById('statsText').textContent =
    total === 0 ? '0 tasks' : `${done} of ${total} completed`;

  // Filter tasks to show
  const visible = tasks.filter(t => {
    if (filter === 'all')    return true;
    if (filter === 'done')   return t.done;
    if (filter === 'active') return !t.done;
  });

  // Empty state
  if (visible.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <div class="icon">${filter === 'done' ? '🎉' : '✨'}</div>
        <p>${filter === 'done' ? 'Nothing completed yet.' : 'No tasks here. Add one above!'}</p>
      </div>`;
    return;
  }

  // Render task items
  list.innerHTML = visible.map(t => `
    <div class="todo-item ${t.done ? 'done' : ''}">
      <input
        type="checkbox"
        class="checkbox"
        ${t.done ? 'checked' : ''}
        onchange="toggleTask(${t.id})"
      />
      <span class="todo-text">${escHtml(t.text)}</span>
      <button
        class="delete-btn"
        onclick="deleteTask(${t.id})"
        title="Delete"
      >✕</button>
    </div>
  `).join('');
}

// ── ENTER KEY SUPPORT ─────
document.getElementById('taskInput')
  .addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addTask();
  });

// ── INITIAL RENDER ON PAGE LOAD ───
render();
