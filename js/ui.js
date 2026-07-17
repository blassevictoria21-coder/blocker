// UI utilities
const UI = {
  // Animation helpers
  animateElement(element, animation, duration = 300) {
    return new Promise(resolve => {
      element.style.animation = `${animation} ${duration}ms ease-out`;
      setTimeout(() => {
        element.style.animation = '';
        resolve();
      }, duration);
    });
  },

  // Collapse/Expand
  toggleCollapse(element) {
    element.classList.toggle('collapsed');
  },

  // Show/Hide
  show(element) {
    element.style.display = '';
  },

  hide(element) {
    element.style.display = 'none';
  },
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + N = New task
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    document.getElementById('taskInput').focus();
  }

  // Escape = Close modal
  if (e.key === 'Escape') {
    const modal = document.getElementById('editModal');
    if (modal.classList.contains('active')) {
      app.closeModal();
    }
  }
});
