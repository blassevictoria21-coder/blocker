// Utility functions
const Utils = {
  // Date utilities
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  getDaysUntil(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  isOverdue(dateString) {
    return new Date(dateString) < new Date() && !document.querySelector(`[data-task-id] .task-item.completed`);
  },

  isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  // String utilities
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  truncate(string, length = 50) {
    return string.length > length ? string.substring(0, length) + '...' : string;
  },

  // Array utilities
  uniqueArray(array) {
    return [...new Set(array)];
  },

  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  },

  // Color utilities
  getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#000000' : '#ffffff';
  },

  // Storage utilities
  getStorageSize() {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return (size / 1024).toFixed(2) + ' KB';
  },
};
