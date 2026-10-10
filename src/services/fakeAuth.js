/** Only account the fake check accepts; the form shows it as a hint. */
export const DEMO_CREDENTIALS = Object.freeze({ username: 'admin', password: 'admin' });

const SIMULATED_LATENCY_MS = 1200;

/**
 * Checks credentials in the browser because there is no backend.
 * The delay keeps the loading state visible.
 */
export function fakeAuthenticate({ username, password }, latency = SIMULATED_LATENCY_MS) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isMatch =
        username.trim() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password;

      if (isMatch) {
        resolve({ username: username.trim() });
      } else {
        reject(new Error('That username and password don’t match. Try the demo account.'));
      }
    }, latency);
  });
}
