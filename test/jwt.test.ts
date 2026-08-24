/**
 * Token verification tests.
 *
 * These run fully offline: we generate an ES256 keypair, serve it from a local
 * JWKS endpoint, and point SUPABASE_URL at that server. No Supabase project and
 * no network are required, so the tests are safe to run in CI.
 *
 * Every case here is a way an attacker or a bug could hand us a token we must
 * refuse. A regression in any of them is a full authentication bypass, which is
 * why they are tested individually rather than as one happy path.
 */

import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { SignJWT, exportJWK, generateKeyPair, type JWK } from 'jose';

const KID = 'test-key-1';
let server: Server;
let baseUrl: string;
let privateKey: CryptoKey;
let otherPrivateKey: CryptoKey;
let verifyAccessToken: typeof import('../src/auth/jwt.js').verifyAccessToken;

before(async () => {
  const pair = await generateKeyPair('ES256', { extractable: true });
  privateKey = pair.privateKey;

  // A second, unrelated key. Tokens signed with it must be rejected even
  // though they are otherwise perfectly well-formed.
  const other = await generateKeyPair('ES256', { extractable: true });
  otherPrivateKey = other.privateKey;

  const publicJwk: JWK = await exportJWK(pair.publicKey);
  publicJwk.kid = KID;
  publicJwk.alg = 'ES256';
  publicJwk.use = 'sig';

  server = createServer((req, res) => {
    if (req.url === '/auth/v1/.well-known/jwks.json') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ keys: [publicJwk] }));
      return;
    }
    res.writeHead(404).end();
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address();
  if (typeof addr === 'string' || addr === null) throw new Error('no address');
  baseUrl = `http://127.0.0.1:${addr.port}`;

  process.env.SUPABASE_URL = baseUrl;
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
  process.env.DATABASE_URL = 'postgres://user@localhost/test';

  // Imported after env is set: the module builds its JWKS client at load time.
  ({ verifyAccessToken } = await import('../src/auth/jwt.js'));
});

after(() => {
  server?.close();
});

interface TokenOptions {
  sub?: string;
  role?: string;
  audience?: string;
  issuer?: string;
  expiresIn?: string;
  issuedAt?: number;
  key?: CryptoKey;
}

async function mint(opts: TokenOptions = {}): Promise<string> {
  const jwt = new SignJWT({
    email: 'user@example.com',
    role: opts.role ?? 'authenticated',
  })
    .setProtectedHeader({ alg: 'ES256', kid: KID })
    .setSubject(opts.sub ?? '11111111-1111-1111-1111-111111111111')
    .setIssuer(opts.issuer ?? `${baseUrl}/auth/v1`)
    .setAudience(opts.audience ?? 'authenticated')
    .setIssuedAt(opts.issuedAt)
    .setExpirationTime(opts.expiresIn ?? '1h');

  return jwt.sign(opts.key ?? privateKey);
}

describe('verifyAccessToken', () => {
  it('accepts a valid token and returns the subject', async () => {
    const user = await verifyAccessToken(await mint());
    assert.equal(user.id, '11111111-1111-1111-1111-111111111111');
    assert.equal(user.email, 'user@example.com');
    assert.equal(user.role, 'authenticated');
  });

  it('rejects an expired token', async () => {
    const token = await mint({ issuedAt: 1_700_000_000, expiresIn: '1s' });
    await assert.rejects(() => verifyAccessToken(token));
  });

  it('rejects a token signed by a different key', async () => {
    // The signature is valid ES256 — just not from a key in our JWKS.
    await assert.rejects(() => verifyAccessToken(await mint({ key: otherPrivateKey })));
  });

  it('rejects a token from a different issuer', async () => {
    await assert.rejects(() =>
      verifyAccessToken(await mint({ issuer: 'https://evil.example.com/auth/v1' })),
    );
  });

  it('rejects a token for a different audience', async () => {
    await assert.rejects(() => verifyAccessToken(await mint({ audience: 'other-service' })));
  });

  it('rejects an anon token', async () => {
    // Supabase issues these to signed-out clients. Treating one as a logged-in
    // user would hand every anonymous visitor an authenticated session.
    await assert.rejects(() => verifyAccessToken(await mint({ role: 'anon' })));
  });

  it('rejects a token with no subject', async () => {
    const token = await new SignJWT({ role: 'authenticated' })
      .setProtectedHeader({ alg: 'ES256', kid: KID })
      .setIssuer(`${baseUrl}/auth/v1`)
      .setAudience('authenticated')
      .setExpirationTime('1h')
      .sign(privateKey);
    await assert.rejects(() => verifyAccessToken(token));
  });

  it('rejects a tampered payload', async () => {
    const token = await mint();
    const [header, payload, signature] = token.split('.');
    const decoded = JSON.parse(Buffer.from(payload!, 'base64url').toString());
    decoded.sub = '22222222-2222-2222-2222-222222222222';
    const forged = Buffer.from(JSON.stringify(decoded)).toString('base64url');
    await assert.rejects(() => verifyAccessToken(`${header}.${forged}.${signature}`));
  });

  it('rejects structurally invalid input', async () => {
    for (const bad of ['', 'not-a-jwt', 'a.b.c', 'Bearer token']) {
      await assert.rejects(() => verifyAccessToken(bad), `should reject: ${bad}`);
    }
  });
});
