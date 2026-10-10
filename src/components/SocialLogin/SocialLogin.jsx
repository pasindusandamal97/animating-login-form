import { FaFacebookF, FaGoogle, FaXTwitter } from 'react-icons/fa6';
import styles from './SocialLogin.module.css';

const PROVIDERS = [
  { name: 'Google', Icon: FaGoogle },
  { name: 'Facebook', Icon: FaFacebookF },
  { name: 'X', Icon: FaXTwitter },
];

/** Social sign-in buttons. Demo only: pressing one does nothing. */
export default function SocialLogin() {
  return (
    <div className={styles.social}>
      <p className={styles.divider}>or continue with</p>
      <ul className={styles.list}>
        {PROVIDERS.map(({ name, Icon }) => (
          <li key={name}>
            <button type="button" className={styles.button} aria-label={`Continue with ${name}`}>
              <Icon aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
