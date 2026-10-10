import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fakeAuthenticate } from '../../services/fakeAuth.js';
import LoginForm from './LoginForm.jsx';

const instantAuth = (values) => fakeAuthenticate(values, 0);

function renderForm(props = {}) {
  const user = userEvent.setup();
  render(<LoginForm authenticate={instantAuth} {...props} />);
  return {
    user,
    username: screen.getByLabelText('Username'),
    password: screen.getByLabelText('Password'),
    submit: screen.getByRole('button', { name: 'Sign in' }),
  };
}

describe('LoginForm', () => {
  it('renders labelled fields and the demo credentials hint', () => {
    const { username, password } = renderForm();

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(username).toHaveAttribute('autocomplete', 'username');
    expect(password).toHaveAttribute('type', 'password');
    expect(screen.getByText(/demo account/i)).toBeInTheDocument();
  });

  it('shows helpful errors and focuses the first invalid field on empty submit', async () => {
    const { user, username, password, submit } = renderForm();

    await user.click(submit);

    expect(username).toHaveAccessibleDescription('Please enter your username.');
    expect(password).toHaveAccessibleDescription('Please enter your password.');
    expect(username).toHaveAttribute('aria-invalid', 'true');
    expect(username).toHaveFocus();
  });

  it('clears a field error as soon as the value becomes valid', async () => {
    const { user, username, submit } = renderForm();

    await user.click(submit);
    await user.type(username, 'adm');

    expect(username).toHaveAttribute('aria-invalid', 'false');
    expect(username).not.toHaveAccessibleDescription();
  });

  it('toggles password visibility', async () => {
    const { user, password } = renderForm();
    const toggle = screen.getByRole('button', { name: 'Show password' });

    await user.click(toggle);
    expect(password).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await user.click(toggle);
    expect(password).toHaveAttribute('type', 'password');
  });

  it('shows a loading state while signing in', async () => {
    let finish;
    const pendingAuth = (values) =>
      new Promise((resolve) => {
        finish = () => resolve({ username: values.username });
      });
    const { user, username, password, submit } = renderForm({ authenticate: pendingAuth });

    await user.type(username, 'admin');
    await user.type(password, 'admin');
    await user.click(submit);

    expect(submit).toHaveTextContent('Signing in…');
    expect(submit).toHaveAttribute('aria-disabled', 'true');

    finish();
    expect(await screen.findByRole('heading', { name: /you’re in, admin/i })).toBeInTheDocument();
  });

  it('signs in with the demo account and can sign out again', async () => {
    const { user, username, password, submit } = renderForm();

    await user.type(username, 'admin');
    await user.type(password, 'admin');
    await user.click(submit);

    const heading = await screen.findByRole('heading', { name: /you’re in, admin/i });
    expect(heading).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(screen.getByLabelText('Username')).toHaveValue('');
    expect(screen.getByLabelText('Username')).toHaveFocus();
  });

  it('reports wrong credentials and clears the alert when the user edits', async () => {
    const { user, username, password, submit } = renderForm();

    await user.type(username, 'admin');
    await user.type(password, 'wrong-password');
    await user.click(submit);

    expect(await screen.findByRole('alert')).toHaveTextContent(/don’t match/i);

    await user.type(password, '!');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the social icons inert', async () => {
    const authenticate = vi.fn();
    const { user } = renderForm({ authenticate });

    await user.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(authenticate).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
