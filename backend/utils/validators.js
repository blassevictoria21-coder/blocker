const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters
  return password && password.length >= 8;
};

const validateSubject = (subject) => {
  // Subject should be 1-500 characters
  return subject && subject.length >= 1 && subject.length <= 500;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateSubject,
};
