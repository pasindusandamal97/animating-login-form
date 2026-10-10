import { useEffect, useRef } from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './LoginForm.module.css';

/** Confirmation shown after a successful sign-in. */
export default function LoginSuccess({ username, onSignOut }) {
  const headingRef = useRef(null);

  // Move focus to the confirmation so screen reader and keyboard users land on it.
  useEffect(() => {
    headingRef.current.focus();
  }, []);

  return (
    <div className={styles.success}>
      <span className={styles.badge} aria-hidden="true">
        <FiCheck />
      </span>
      <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
        You’re in, {username}!
      </h1>
      <p className={styles.subtitle}>This was a simulated sign-in. Nothing was sent to a server.</p>
      <button type="button" className={styles.secondary} onClick={onSignOut}>
        Sign out
      </button>
    </div>
  );
}
