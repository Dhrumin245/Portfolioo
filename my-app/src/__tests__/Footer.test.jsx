import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Footer component', () => {
  it('renders social links and contact info correctly', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /GitHub/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Services/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Solutions/i })).toBeInTheDocument();
    expect(screen.getByText(/DHRUMIN TECH WORLD/i)).toBeInTheDocument();
  });
});
