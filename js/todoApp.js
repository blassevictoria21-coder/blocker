class TodoApp {
  constructor() {
    this.storage = storage;
    this.currentFilter = 'today';
    this.currentCategory = null;
    this.searchQuery = '';
    this.viewType = 'list';
    this.editingTaskId = null;

    this.storage.initialize();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderUI();
    this.loadSettings();
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleFilterChange(e));
    });

    // Add task
    document.getElementById('addTaskForm').addEventListener('submit', (e) => this.handleAddTask(e));

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));
    document.getElementById('clearSearchBtn').addEventListener('click', () => this.clearSearch());

    // View options
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleViewChange(e));
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // Category
    document.getElementById('addCategoryBtn').addEventListener('click', () => this.showAddCategoryDialog());

    // Modal
    document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('editForm').addEventListener('submit', (e) => this.handleEditTask(e));

    // Import/Export
    document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
    document.getElementById('importBtn').addEventListener('click', () => this.importData());
    document.getElementById('importFileInput').addEventListener('change', (e) => this.handleFileImport(e));
  }

  handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    this.currentFilter = filter;
    this.currentCategory = null;
    this.searchQuery = '';
    document.getElementById('searchInput').value = '';

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    this.updatePageTitle();
    this.renderTasks();
  }

  handleSearch(e) {
    this.searchQuery = e.target.value.toLowerCase();
    this.renderTasks();
  }

  clearSearch() {
    this.searchQuery = '';
    document.getElementById('searchInput').value = '';
    this.renderTasks();
  }

  handleViewChange(e) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    this.viewType = e.target.dataset.view;
    const container = document.getElementById('tasksContainer');
    container.classList.toggle('grid-view', this.viewType === 'grid');
  }

  handleAddTask(e) {
    e.preventDefault();

    const title = document.getElementById('taskInput').value.trim();
    const priority = document.getElementById('prioritySelect').value;
    const category = document.getElementById('categorySelect').value;
    const dueDate = document.getElementById('dueDateInput').value;
    const recurring = document.getElementById('recurringCheckbox').checked;

    if (!title) return;

    const task = this.storage.addTask({
      title,
      priority,
      category,
      dueDate: dueDate || null,
      recurring,
      description: '',
    });

    this.showToast('✓ Task added successfully', 'success');
    document.getElementById('addTaskForm').reset();
    this.renderTasks();
  }

  handleEditTask(e) {
    e.preventDefault();

    if (!this.editingTaskId) return;

    const title = document.getElementById('editTaskInput').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const priority = document.getElementById('editPriority').value;
    const category = document.getElementById('editCategory').value;
    const dueDate = document.getElementById('editDueDate').value;
    const recurring = document.getElementById('editRecurring').checked;

    this.storage.updateTask(this.editingTaskId, {
      title,
      description,
      priority,
      category,
      dueDate: dueDate || null,
      recurring,
    });

    this.showToast('✓ Task updated successfully', 'success');
    this.closeModal();
    this.renderTasks();
  }

  getFilteredTasks() {
    const tasks = this.storage.getTasks() || [];
    const today = new Date().toDateString();

    return tasks.filter(task => {
      // Apply filter
      if (this.currentFilter === 'today') {
        const taskDate = new Date(task.dueDate).toDateString();
        if (taskDate !== today && !(!task.dueDate && !task.completed)) return false;
      } else if (this.currentFilter === 'upcoming') {
        if (!task.dueDate || new Date(task.dueDate) <= new Date(today)) return false;
      } else if (this.currentFilter === 'active') {
        if (task.completed) return false;
      } else if (this.currentFilter === 'completed') {
        if (!task.completed) return false;
      }

      // Apply category filter
      if (this.currentCategory && task.category !== this.currentCategory) return false;

      // Apply search
      if (this.searchQuery) {
        return task.title.toLowerCase().includes(this.searchQuery) ||
               (task.description && task.description.toLowerCase().includes(this.searchQuery));
      }

      return true;
    });
  }

  updateStats() {
    const tasks = this.storage.getTasks() || [];
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('taskCount').textContent = `${total} task${total !== 1 ? 's' : ''}`;
  }

  updatePageTitle() {
    const titles = {
      today: '📅 Today',
      upcoming: '🗓️ Upcoming',
      active: '⏳ Active',
      completed: '✅ Completed',
      all: '📋 All Tasks',
    };
    document.getElementById('pageTitle').textContent = titles[this.currentFilter] || 'Tasks';
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    const settings = this.storage.getSettings();
    settings.darkMode = isDark;
    this.storage.setSettings(settings);
  }

  loadSettings() {
    const settings = this.storage.getSettings();
    if (settings.darkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  }

  showAddCategoryDialog() {
    const name = prompt('Enter category name:');
    if (name && name.trim()) {
      this.storage.addCategory(name.trim());
      this.renderUI();
      this.showToast('✓ Category added', 'success');
    }
  }

  exportData() {
    const data = this.storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pro-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('✓ Data exported', 'success');
  }

  importData() {
    document.getElementById('importFileInput').click();
  }

  handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = this.storage.importData(event.target.result);
      if (success) {
        this.showToast('✓ Data imported successfully', 'success');
        location.reload();
      } else {
        this.showToast('✗ Failed to import data', 'error');
      }
    };
    reader.readAsText(file);
  }

  openEditModal(taskId) {
    const task = this.storage.getTask(taskId);
    if (!task) return;

    this.editingTaskId = taskId;
    document.getElementById('editTaskInput').value = task.title;
    document.getElementById('editDescription').value = task.description || '';
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editCategory').value = task.category;
    document.getElementById('editDueDate').value = task.dueDate || '';
    document.getElementById('editRecurring').checked = task.recurring || false;

    document.getElementById('editModal').classList.add('active');
  }

  closeModal() {
    document.getElementById('editModal').classList.remove('active');
    this.editingTaskId = null;
  }

  deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.storage.deleteTask(taskId);
      this.showToast('✓ Task deleted', 'success');
      this.renderTasks();
    }
  }

  toggleTaskComplete(taskId) {
    const task = this.storage.getTask(taskId);
    this.storage.updateTask(taskId, { completed: !task.completed });
    this.renderTasks();
  }

  renderTasks() {
    const filteredTasks = this.getFilteredTasks();
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');

    if (filteredTasks.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'flex';
      this.updateStats();
      return;
    }

    container.style.display = this.viewType === 'grid' ? 'grid' : 'flex';
    container.innerHTML = filteredTasks.map(task => this.createTaskElement(task)).join('');

    // Add event listeners
    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.toggleTaskComplete(e.target.dataset.taskId);
      });
    });

    container.querySelectorAll('.task-item').forEach(item => {
      item.querySelector('.task-content').addEventListener('click', () => {
        this.openEditModal(item.dataset.taskId);
      });
    });

    container.querySelectorAll('.task-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteTask(btn.dataset.taskId);
      });
    });

    emptyState.style.display = 'none';
    this.updateStats();
  }

  createTaskElement(task) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    const daysUntilDue = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

    const priorityEmojis = { high: '🔴', medium: '🟡', low: '🟢' };
    const categoryName = this.storage.getCategories().find(c => c.id === task.category)?.name || 'General';

    return `
      <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''}
          data-task-id="${task.id}"
        >
        <div class="task-content">
          <div class="task-header">
            <div class="task-title">${this.escapeHtml(task.title)}</div>
            <div class="task-actions">
              <button class="task-btn delete" data-task-id="${task.id}" title="Delete">🗑️</button>
            </div>
          </div>
          ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
          <div class="task-meta">
            <span class="task-badge priority ${task.priority}">${priorityEmojis[task.priority]} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            <span class="task-badge category">📁 ${categoryName}</span>
            ${task.dueDate ? `<span class="task-badge due-date ${isOverdue ? 'overdue' : ''}">${isOverdue ? '⚠️ ' : '📅 '}${new Date(task.dueDate).toLocaleDateString()}${daysUntilDue !== null && daysUntilDue >= 0 ? ` (${daysUntilDue}d)` : ''}</span>` : ''}
            ${task.recurring ? '<span class="task-badge">🔄 Recurring</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderUI() {
    this.renderCategories();
    this.renderCategoryOptions();
    this.renderTasks();
  }

  renderCategories() {
    const categories = this.storage.getCategories() || [];
    const list = document.getElementById('categoriesList');
    list.innerHTML = categories.map(cat => `
      <li>
        <button class="category-item" data-category-id="${cat.id}" style="--color: ${cat.color}">
          <span>${cat.name}</span>
          <span class="category-count">${this.storage.getTasks().filter(t => t.category === cat.id).length}</span>
        </button>
      </li>
    `).join('');

    list.querySelectorAll('.category-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = null;
        this.currentCategory = btn.dataset.categoryId;
        this.searchQuery = '';
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        list.querySelectorAll('.category-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePageTitle();
        this.renderTasks();
      });
    });
  }

  renderCategoryOptions() {
    const categories = this.storage.getCategories() || [];
    const selects = [document.getElementById('categorySelect'), document.getElementById('editCategory')];
    const options = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    selects.forEach(select => {
      select.innerHTML = options;
    });
  }
}

const app = new TodoApp();
