import express from 'express';
import { requireAuth } from './auth/middleware.js';
import { getProfile, updateProfile } from './db.js';
import { env } from './env.js';

export const app = express();

app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/**
 * The token identifies the user, so there is no :userId in the path and
 * nothing for a caller to tamper with. Prefer this shape over
 * /users/:id/profile wherever the answer is always "the caller".
 */
app.get('/me', requireAuth, async (req, res) => {
  const profile = await getProfile(req.user!.id);
  if (!profile) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  res.json(profile);
});

app.patch('/me', requireAuth, async (req, res) => {
  const { display_name, avatar_url } = req.body ?? {};

  if (display_name !== undefined && typeof display_name !== 'string') {
    res.status(400).json({ error: 'display_name must be a string' });
    return;
  }
  if (avatar_url !== undefined && typeof avatar_url !== 'string') {
    res.status(400).json({ error: 'avatar_url must be a string' });
    return;
  }

  const profile = await updateProfile(req.user!.id, { display_name, avatar_url });
  if (!profile) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  res.json(profile);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`listening on :${env.PORT}`);
  });
}
