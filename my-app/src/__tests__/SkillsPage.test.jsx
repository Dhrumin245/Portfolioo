import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SkillsPage from '../pages/SkillsPage';

describe('SkillsPage component', () => {
  it('renders skills section and skill cards', () => {
    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: /My Skills/i })).toBeInTheDocument();
    expect(screen.getByText(/Python Development/i)).toBeInTheDocument();
    expect(screen.getByText(/Backend Development/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Management/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Home/i })).toBeInTheDocument();
  });
});
