class TodoStorage {
  constructor() {
    this.storageKey = 'pro-todo-data';
    this.categoriesKey = 'pro-todo-categories';
    this.settingsKey = 'pro-todo-settings';
  }

  // Initialize default data
  initialize() {
    if (!this.getTasks()) {
      this.setTasks([]);
    }
    if (!this.getCategories()) {
      this.setCategories([
        { id: 'general', name: 'General', color: '#6366f1' },
        { id: 'work', name: 'Work', color: '#3b82f6' },
        { id: 'personal', name: 'Personal', color: '#10b981' },
      ]);
    }
    if (!this.getSettings()) {
      this.setSettings({ darkMode: false });
    }
  }

  // Tasks
  getTasks() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading tasks:', error);
      return null;
    }
  }

  setTasks(tasks) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  addTask(task) {
    const tasks = this.getTasks() || [];
    const newTask = {
      id: Date.now().toString(),
      ...task,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    this.setTasks(tasks);
    return newTask;
  }

  updateTask(id, updates) {
    const tasks = this.getTasks() || [];
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.setTasks(tasks);
      return tasks[index];
    }
    return null;
  }

  deleteTask(id) {
    const tasks = this.getTasks() || [];
    const filtered = tasks.filter(t => t.id !== id);
    this.setTasks(filtered);
  }

  getTask(id) {
    const tasks = this.getTasks() || [];
    return tasks.find(t => t.id === id);
  }

  // Categories
  getCategories() {
    try {
      const data = localStorage.getItem(this.categoriesKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading categories:', error);
      return null;
    }
  }

  setCategories(categories) {
    try {
      localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  addCategory(name, color = '#6366f1') {
    const categories = this.getCategories() || [];
    const newCategory = {
      id: Date.now().toString(),
      name,
      color,
    };
    categories.push(newCategory);
    this.setCategories(categories);
    return newCategory;
  }

  deleteCategory(id) {
    const categories = this.getCategories() || [];
    const filtered = categories.filter(c => c.id !== id);
    this.setCategories(filtered);
  }

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(this.settingsKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading settings:', error);
      return null;
    }
  }

  setSettings(settings) {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Import/Export
  exportData() {
    const data = {
      tasks: this.getTasks(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.tasks) this.setTasks(data.tasks);
      if (data.categories) this.setCategories(data.categories);
      if (data.settings) this.setSettings(data.settings);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAll() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.categoriesKey);
    localStorage.removeItem(this.settingsKey);
  }
}

const storage = new TodoStorage();
