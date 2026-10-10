import { describe, expect, it } from 'vitest';
import { validateField, validateLogin } from './validateLogin.js';

describe('validateField', () => {
  it('requires a username', () => {
    expect(validateField('username', '   ')).toBe('Please enter your username.');
  });

  it('enforces a minimum username length', () => {
    expect(validateField('username', 'ab')).toMatch(/at least 3 characters/);
  });

  it('rejects unsupported username characters', () => {
    expect(validateField('username', 'bad name!')).toMatch(/only letters, numbers/);
  });

  it('enforces a minimum password length', () => {
    expect(validateField('password', '1234')).toMatch(/at least 5 characters/);
  });

  it('accepts valid values', () => {
    expect(validateField('username', 'jane.doe')).toBe('');
    expect(validateField('password', 'secret')).toBe('');
  });
});

describe('validateLogin', () => {
  it('returns only the fields that have errors', () => {
    expect(validateLogin({ username: 'admin', password: '' })).toEqual({
      password: 'Please enter your password.',
    });
  });

  it('returns an empty object for valid credentials', () => {
    expect(validateLogin({ username: 'admin', password: 'admin' })).toEqual({});
  });
});
