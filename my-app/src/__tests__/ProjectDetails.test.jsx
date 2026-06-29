import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectDetails from '../pages/ProjectDetails';

vi.mock('../components/animations/Animations/SplashCursor/SplashCursor', () => ({
  default: () => <div data-testid="splash-cursor" />,
}));

describe('ProjectDetails component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('renders loading state initially and then project details when fetch succeeds', async () => {
    const mockProject = {
      title: 'Real-time AI Chat',
      slug: 'ai-chat',
      description: 'An AI chat app',
      blocks: [],
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProject,
    });

    render(
      <MemoryRouter initialEntries={['/project/ai-chat']}>
        <Routes>
          <Route path="/project/:slug" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading case study/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Real-time AI Chat/i)).toBeInTheDocument();
    });
  });

  it('renders coming soon message when project is not found', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <MemoryRouter initialEntries={['/project/unknown']}>
        <Routes>
          <Route path="/project/:slug" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Project coming soon/i)).toBeInTheDocument();
    });
  });
});
