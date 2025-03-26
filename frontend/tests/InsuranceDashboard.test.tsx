import { render, screen, waitFor } from '@testing-library/react';
import InsuranceDashboard from '../components/InsuranceDashboard';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('InsuranceDashboard', () => {
  it('renders insurance dashboard', async () => {
    const mock = new MockAdapter(axios);
    const claims = [
      { id: 1, status: 'Pending', description: 'Claim 1 description' },
      { id: 2, status: 'Approved', description: 'Claim 2 description' },
    ];
    mock.onGet('/api/insurance').reply(200, claims);

    render(<InsuranceDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Claim ID: 1')).toBeInTheDocument();
      expect(screen.getByText('Claim ID: 2')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/insurance').reply(500);

    render(<InsuranceDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch claims')).toBeInTheDocument();
    });
  });
});
