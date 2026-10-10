import LoginForm from './components/LoginForm/LoginForm.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <main className={styles.main}>
        <LoginForm />
      </main>
      <footer className={styles.footer}>
        Front-end demo &middot; sign-in is simulated and no data leaves your browser
      </footer>
    </div>
  );
}
