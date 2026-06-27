import dotenv from 'dotenv';

dotenv.config();

const getAdminApiKey = () => {
  // Prefer dedicated key
  if (process.env.ADMIN_API_KEY) return process.env.ADMIN_API_KEY;
  // Fallback to a generic key (optional)
  if (process.env.API_KEY) return process.env.API_KEY;
  return null;
};

export function requireAdmin(req, res, next) {
  const adminApiKey = getAdminApiKey();

  // If no key is configured, fail closed (admin routes are not accessible)
  if (!adminApiKey) {
    return res.status(500).json({ error: 'ADMIN_API_KEY is not configured on the server' });
  }

  const provided = req.headers['x-admin-api-key'];
  if (!provided || provided !== adminApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

