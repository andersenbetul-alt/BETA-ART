import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, type AuthenticatedUser } from './jwt.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Rejects any request without a valid Supabase access token.
 *
 * Failures are deliberately indistinguishable to the caller: a malformed
 * header, a bad signature and an expired token all return the same opaque
 * 401. Distinguishing them tells an attacker which half of a guess was right.
 * The real reason is logged server-side.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.header('authorization');

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    req.user = await verifyAccessToken(token);
    next();
  } catch (err) {
    console.warn('access token rejected', { path: req.path, err });
    res.status(401).json({ error: 'unauthorized' });
  }
}

/**
 * Guards routes that act on a specific user's data.
 *
 * Because the backend queries Postgres with the service_role key, RLS is
 * BYPASSED — the database will not stop one user reading another's row.
 * Ownership must therefore be enforced here, in application code. This is
 * the single most important consequence of choosing a backend API over
 * direct client access with RLS.
 */
export function requireSelf(paramName = 'userId') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    if (req.params[paramName] !== req.user.id) {
      // 404, not 403: a 403 confirms the resource exists.
      res.status(404).json({ error: 'not found' });
      return;
    }
    next();
  };
}
