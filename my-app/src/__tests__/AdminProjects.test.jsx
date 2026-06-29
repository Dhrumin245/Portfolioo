import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminProjects from '../pages/AdminProjects';

describe('AdminProjects page component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    import.meta.env.VITE_ADMIN_API_KEY = 'test-key';
  });

  it('renders admin dashboard heading and fetches projects list', async () => {
    const mockProjects = [
      { id: '1', title: 'Admin App', slug: 'admin-app', status: 'published', category: 'Web App' },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects,
    });

    render(
      <MemoryRouter>
        <AdminProjects />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: /Projects/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Admin App/i)).toBeInTheDocument();
    });
  });
});
