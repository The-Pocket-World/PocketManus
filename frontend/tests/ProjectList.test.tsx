import { render, screen, waitFor } from '@testing-library/react';
import ProjectList from '../components/ProjectList';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('ProjectList', () => {
  it('renders project list', async () => {
    const mock = new MockAdapter(axios);
    const projects = [
      { id: 1, name: 'Project 1', description: 'Description 1' },
      { id: 2, name: 'Project 2', description: 'Description 2' },
    ];
    mock.onGet('/api/projects').reply(200, projects);

    render(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/projects').reply(500);

    render(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch projects')).toBeInTheDocument();
    });
  });
});
