import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { requireAdmin } from '../../middleware/adminAuth.js';

describe('requireAdmin middleware', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 500 if ADMIN_API_KEY and API_KEY are not configured', () => {
    delete process.env.ADMIN_API_KEY;
    delete process.env.API_KEY;

    const req = { headers: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'ADMIN_API_KEY is not configured on the server' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if x-admin-api-key header is missing or invalid', () => {
    process.env.ADMIN_API_KEY = 'secret-key-123';

    const req = { headers: { 'x-admin-api-key': 'wrong-key' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if valid x-admin-api-key header is provided', () => {
    process.env.ADMIN_API_KEY = 'secret-key-123';

    const req = { headers: { 'x-admin-api-key': 'secret-key-123' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
