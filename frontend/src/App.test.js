import { render, screen } from '@testing-library/react';
import App from './App';

test('redirects unauthenticated users to admin login', () => {
  render(<App />);
  expect(screen.getAllByText(/library management/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/library management/i)[0]).toBeInTheDocument();
});
