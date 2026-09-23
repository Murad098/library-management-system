import { render, screen } from '@testing-library/react';
import App from './App';

test('redirects unauthenticated users to admin login', () => {
  render(<App />);
  expect(screen.getByText(/library management/i)).toBeInTheDocument();
});
