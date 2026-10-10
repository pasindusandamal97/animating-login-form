import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './PasswordToggle.module.css';

/** Button that shows or hides the password input it controls. */
export default function PasswordToggle({ visible, onToggle, controls }) {
  const Icon = visible ? FiEyeOff : FiEye;

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      // Keep focus and the caret in the input when the toggle is clicked with a mouse.
      onMouseDown={(event) => event.preventDefault()}
      aria-controls={controls}
      aria-pressed={visible}
      aria-label="Show password"
      title={visible ? 'Hide password' : 'Show password'}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
