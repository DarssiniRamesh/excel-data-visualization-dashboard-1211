import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header brand', () => {
  render(<App />);
  const brand = screen.getByText(/Excel DataViz/i);
  expect(brand).toBeInTheDocument();
});
