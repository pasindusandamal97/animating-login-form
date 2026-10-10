import { useState } from 'react';
import { validateField, validateLogin } from '../utils/validateLogin.js';

const INITIAL_VALUES = { username: '', password: '' };

/**
 * Login form state: values, errors and submit status.
 * status is 'idle' | 'submitting' | 'success' | 'error'.
 */
export function useLoginForm(authenticate) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [user, setUser] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    // Re-check a field that shows an error so the message clears once it is fixed.
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
    if (status === 'error') {
      setStatus('idle');
      setSubmitError('');
    }
  };

  // Skip empty fields on blur so tabbing through an empty form shows no errors.
  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (value) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
  };

  // Returns the validation errors so the caller can focus the first invalid field.
  const submit = async () => {
    if (status === 'submitting') return {};

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return validationErrors;

    setStatus('submitting');
    setSubmitError('');
    try {
      setUser(await authenticate(values));
      setStatus('success');
    } catch (error) {
      setSubmitError(error.message);
      setStatus('error');
    }
    return {};
  };

  const reset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setStatus('idle');
    setSubmitError('');
    setUser(null);
  };

  return { values, errors, status, submitError, user, handleChange, handleBlur, submit, reset };
}
