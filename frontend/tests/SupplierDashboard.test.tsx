import { render, screen, waitFor } from '@testing-library/react';
import SupplierDashboard from '../components/SupplierDashboard';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('SupplierDashboard', () => {
  it('renders supplier dashboard', async () => {
    const mock = new MockAdapter(axios);
    const listings = [
      { id: 1, title: 'Listing 1', description: 'Description 1' },
      { id: 2, title: 'Listing 2', description: 'Description 2' },
    ];
    mock.onGet('/api/marketplace').reply(200, listings);

    render(<SupplierDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Listing 1')).toBeInTheDocument();
      expect(screen.getByText('Listing 2')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/marketplace').reply(500);

    render(<SupplierDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch listings')).toBeInTheDocument();
    });
  });
});
