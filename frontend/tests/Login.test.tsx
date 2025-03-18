import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../components/Login';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays error message on invalid login', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMessage = await screen.findByText(/invalid login credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('redirects to dashboard on successful login', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'valid@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'correctpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const dashboardHeading = await screen.findByText(/dashboard/i);
    expect(dashboardHeading).toBeInTheDocument();
  });
});
