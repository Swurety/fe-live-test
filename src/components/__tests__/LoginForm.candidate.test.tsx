import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../LoginForm'
import { login } from '../../api/auth';

jest.mock('../../api/auth', () => ({
  login: jest.fn(),
}));

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'secret';
const INVALID_USERNAME = 'wronguser';
const INVALID_PASSWORD = 'wrongpass';

describe('LoginForm Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/username/i)).not.toBeNull();
    expect(screen.getByLabelText(/password/i)).not.toBeNull();
    expect(screen.getByRole('button', { name: /log in/i })).not.toBeNull();
  });

  test('shows error when fields are empty', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /log in/i }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Username and password are required');
  });

  test('shows error when credentials are invalid', async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), INVALID_USERNAME);
    await user.type(screen.getByLabelText(/password/i), INVALID_PASSWORD);
    await user.click(screen.getByRole('button', { name: /log in/i }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Invalid credentials');
  });

  test('logs in successfully with valid credentials', async () => {
    (login as jest.Mock).mockResolvedValueOnce({ username: VALID_USERNAME });

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), VALID_USERNAME);
    await user.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await user.click(screen.getByRole('button', { name: /log in/i }));

    const welcomeMessage = await screen.findByText((content) =>
      content.includes(`Welcome, ${VALID_USERNAME}!`)
    );
    expect(welcomeMessage).not.toBeNull();
  });
});
