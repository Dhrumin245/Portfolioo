import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

describe('ScrollToTop component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('scrolls to top on initial render without hash', () => {
    render(
      <MemoryRouter initialEntries={['/skills']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
