import styles from './FormField.module.css';

/**
 * Labelled input with an inline error and an optional trailing control (e.g. show password).
 * `onFocusChange(isFocused)` fires when focus enters or leaves the field or its trailing control.
 */
export default function FormField({
  id,
  label,
  error,
  trailing,
  onFocusChange,
  ref,
  ...inputProps
}) {
  const errorId = `${id}-error`;

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange?.(false);
  };

  return (
    <div className={styles.field} onFocus={() => onFocusChange?.(true)} onBlur={handleBlur}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control} data-invalid={Boolean(error)}>
        <input
          id={id}
          ref={ref}
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
