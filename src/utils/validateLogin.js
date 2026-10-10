const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 5;

const validators = {
  username(value) {
    const username = value.trim();
    if (!username) return 'Please enter your username.';
    if (username.length < USERNAME_MIN_LENGTH) {
      return `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
    }
    if (!USERNAME_PATTERN.test(username)) {
      return 'Use only letters, numbers, dots, dashes or underscores.';
    }
    return '';
  },
  password(value) {
    if (!value) return 'Please enter your password.';
    if (value.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }
    return '';
  },
};

/** Returns the error message for one field, or '' when it is valid. */
export function validateField(name, value) {
  return validators[name]?.(value) ?? '';
}

/** Returns only the fields that have errors. */
export function validateLogin(values) {
  return Object.fromEntries(
    Object.keys(validators)
      .map((name) => [name, validateField(name, values[name] ?? '')])
      .filter(([, message]) => message),
  );
}
