import { render, screen } from '@testing-library/react';
import { App } from './App';
import { AppProviders } from './providers/AppProviders';
import { buildings } from './config/buildings';

test('renders buildings from config', () => {
  render(
    <AppProviders>
      <App />
    </AppProviders>
  );

  expect(screen.getAllByTestId('building-card')).toHaveLength(buildings.length);
  expect(
    screen.getByRole('heading', { name: /elevator simulator/i })
  ).toBeInTheDocument();
});
