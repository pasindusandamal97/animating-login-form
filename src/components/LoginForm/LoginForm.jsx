import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import FormField from '../FormField/FormField.jsx';
import Mascot from '../Mascot/Mascot.jsx';
import PasswordToggle from '../PasswordToggle/PasswordToggle.jsx';
import SocialLogin from '../SocialLogin/SocialLogin.jsx';
import LoginSuccess from './LoginSuccess.jsx';
import { useLoginForm } from '../../hooks/useLoginForm.js';
import { DEMO_CREDENTIALS, fakeAuthenticate } from '../../services/fakeAuth.js';
import styles from './LoginForm.module.css';

// Characters needed for the mascot's gaze to sweep across the username input.
const GAZE_SPAN_CHARS = 24;

function getMascotMood({ status, activeField, showPassword }) {
  if (status === 'success') return 'happy';
  if (status === 'error') return 'sad';
  if (status === 'submitting') return 'thinking';
  if (activeField === 'password') return showPassword ? 'peek' : 'shy';
  if (activeField === 'username') return 'watching';
  return 'idle';
}

/**
 * Animated login card. `authenticate(values)` must return a promise.
 * It defaults to a fake in-browser check because there is no backend.
 */
export default function LoginForm({ authenticate = fakeAuthenticate }) {
  const { values, errors, status, submitError, user, handleChange, handleBlur, submit, reset } =
    useLoginForm(authenticate);
  const [activeField, setActiveField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const isSubmitting = status === 'submitting';
  const mood = getMascotMood({ status, activeField, showPassword });
  const gaze = Math.min(values.username.length / GAZE_SPAN_CHARS, 1);

  const trackFocus = (field) => (isFocused) => setActiveField(isFocused ? field : null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = await submit();
    if (validationErrors.username) usernameRef.current.focus();
    else if (validationErrors.password) passwordRef.current.focus();
  };

  const handleSignOut = () => {
    // Render the form now so focus can move back to its first field.
    flushSync(() => {
      reset();
      setShowPassword(false);
    });
    usernameRef.current.focus();
  };

  return (
    <section className={styles.card}>
      <div className={styles.mascot}>
        <Mascot mood={mood} gaze={gaze} />
      </div>

      {status === 'success' ? (
        <LoginSuccess username={user.username} onSignOut={handleSignOut} />
      ) : (
        <>
          <header className={styles.header}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to continue. The bear promises not to peek.</p>
            <p className={styles.demoHint}>
              Demo account: <kbd>{DEMO_CREDENTIALS.username}</kbd> /{' '}
              <kbd>{DEMO_CREDENTIALS.password}</kbd>
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <FormField
              ref={usernameRef}
              id="username"
              name="username"
              label="Username"
              type="text"
              placeholder="e.g. admin"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={values.username}
              error={errors.username}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocusChange={trackFocus('username')}
            />
            <FormField
              ref={passwordRef}
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              autoComplete="current-password"
              required
              value={values.password}
              error={errors.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocusChange={trackFocus('password')}
              trailing={
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((visible) => !visible)}
                  controls="password"
                />
              }
            />

            {submitError && (
              <p className={styles.alert} role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className={styles.submit}
              aria-disabled={isSubmitting}
              data-loading={isSubmitting}
            >
              {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <SocialLogin />
        </>
      )}
    </section>
  );
}
