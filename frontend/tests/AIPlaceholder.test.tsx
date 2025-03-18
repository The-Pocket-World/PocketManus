import { render, screen } from '@testing-library/react';
import AIPlaceholder from '../components/AIPlaceholder';

describe('AIPlaceholder', () => {
  it('renders AI/ML features placeholder', () => {
    render(<AIPlaceholder />);
    expect(screen.getByText('AI/ML Features Placeholder')).toBeInTheDocument();
    expect(screen.getByText('This section will include AI/ML functionalities such as roof damage assessment and scheduling optimization.')).toBeInTheDocument();
  });
});
