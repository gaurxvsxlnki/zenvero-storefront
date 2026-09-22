import { createHmac, timingSafeEqual } from 'node:crypto';
import { createReadStream } from 'node:fs';
import type { Stats } from 'node:fs';
import statFn from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

/**
 * ZenVero Secure Vault Server (DEMO-GRADE)
 * =========================================
 * The storefront is a Vite SPA with no standalone backend. This plugin turns
 * the Vite dev/preview server into the demo's entitlement server so the paid
 * PDF for "The Calm Compounding Operator" (zv-001) is:
 *
 *   1. NEVER inside /public — it lives in <repo>/vault/ebooks/ and is not
 *      copied into the build output (dist/), so there is no public/static URL
 *      that serves the file.
 *   2. Streamed ONLY through GET /api/vault/download/:ebookId after the
 *      request presents an HMAC-SHA256 signed entitlement token that this
 *      server minted for a registered verified order. The signing secret
 *      lives here, in server-side code only — it is never bundled into the
 *      client JS.
 *
 * PRODUCTION SEAM (the single place to swap):
 *   - `registerVerifiedOrder()`  -> replace with your payment provider's
 *     webhook / order DB write (e.g. Stripe `checkout.session.completed`).
 *   - `findVerifiedOrderFor()`   -> replace with a real DB lookup bound to
 *     the authenticated user session.
 *   - `mintEntitlementToken()`   -> keep, or issue short-lived signed URLs
 *     from your object storage (S3 #signed-URL, R2, etc.) instead of
 *     streaming from disk.
 *
 * HONEST LIMITS of this demo: `registerVerifiedOrder` trusts whoever calls
 * it (there is no real payment gateway), and tokens are replayable until
 * they expire. That is exactly what a demo checkout can offer. Do not ship
 * this to production without replacing the seams above with real
 * server-side payment verification and per-user sessions.
 */

/** Which vault-protected editions exist and what file/stream name they map to. */
const VAULT_ASSETS: Record<
  string,
  { sourceFileName: string; downloadFilename: string }
> = {
  'zv-001': {
    sourceFileName: 'calm-compounding-operator-v4.pdf',
    downloadFilename: 'ZenVero-The-Calm-Compounding-Operator.pdf',
  },
};

/** vault://zenvero-editions/<file> maps to <repo>/vault/ebooks/<file> on disk. */
const VAULT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../vault/ebooks'
);

/**
 * HMAC secret for entitlement tokens. Server-side ONLY (this file never
 * reaches the client bundle). Override in real deployments via env var.
 */
const VAULT_SECRET =
  process.env.ZENVERO_VAULT_SECRET ?? 'zenvero-dev-vault-secret-do-not-ship';

/** Entitlement token lifetime: 24 hours (client silently re-mints after that). */
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Demo "order DB": orderId -> ebookIds that completed checkout.
 * PRODUCTION SEAM — see header comment.
 */
const verifiedOrders = new Map<string, Set<string>>();

const registerVerifiedOrder = (orderId: string, ebookIds: string[]) => {
  if (!verifiedOrders.has(orderId)) {
    verifiedOrders.set(orderId, new Set());
  }
  const items = verifiedOrders.get(orderId)!;
  ebookIds.forEach((id) => items.add(id));
};

// ---------------------------------------------------------------------------
// Signed entitlement tokens
// ---------------------------------------------------------------------------

interface EntitlementPayload {
  v: 1;
  ebookId: string;
  orderId: string;
  iat: number;
  exp: number;
}

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url');

const sign = (payloadB64: string) =>
  base64url(createHmac('sha256', VAULT_SECRET).update(payloadB64).digest());

const mintEntitlementToken = (
  ebookId: string,
  orderId: string
): { token: string; expiresAt: number } => {
  const iat = Date.now();
  const exp = iat + TOKEN_TTL_MS;
  const payload: EntitlementPayload = { v: 1, ebookId, orderId, iat, exp };
  const payloadB64 = base64url(JSON.stringify(payload));
  return { token: `${payloadB64}.${sign(payloadB64)}`, expiresAt: exp };
};

const verifyEntitlementToken = (
  token: string,
  ebookId: string
): EntitlementPayload | null => {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = Buffer.from(sign(payloadB64));
  const provided = Buffer.from(sig);
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    ) as EntitlementPayload;
    if (payload.v !== 1) return null;
    if (payload.ebookId !== ebookId) return null;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const readJsonBody = (req: IncomingMessage): Promise<Record<string, unknown>> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
      if (chunks.reduce((n, c) => n + c.length, 0) > 64 * 1024) {
        resolve({}); // refuse oversized bodies
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        resolve(parsed && typeof parsed === 'object' ? parsed : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });

const bearerToken = (req: IncomingMessage): string | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token || null;
};

const vaultFilePath = (ebookId: string): string | null => {
  const asset = VAULT_ASSETS[ebookId];
  if (!asset) return null;
  return path.join(VAULT_DIR, asset.sourceFileName);
};

const streamVaultPdf = async (
  res: ServerResponse,
  ebookId: string
): Promise<void> => {
  const asset = VAULT_ASSETS[ebookId];
  const filePath = vaultFilePath(ebookId);
  if (!asset || !filePath) {
    sendJson(res, 404, { error: 'VAULT_ASSET_UNKNOWN', ebookId });
    return;
  }

  let stats: Stats;
  try {
    stats = await statFn.stat(filePath);
  } catch {
    // The entitlement check passed — the paid file simply is not provisioned
    // on this server yet. Be explicit instead of pretending to download.
    sendJson(res, 404, {
      error: 'VAULT_ASSET_MISSING',
      hint: `Place the paid PDF at vault/ebooks/${asset.sourceFileName} on the server.`,
      ebookId,
    });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stats.size,
    'Content-Disposition': `attachment; filename="${asset.downloadFilename}"`,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(filePath).pipe(res);
};

// ---------------------------------------------------------------------------
// API routing (shared by `vite dev` and `vite preview`)
// ---------------------------------------------------------------------------

const handleApiRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): Promise<boolean> => {
  // --- Purchase registration (DEMO stand-in for the payment webhook) ------
  if (pathname === '/api/vault/verified-orders' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const orderId = typeof body.orderId === 'string' ? body.orderId : '';
    const ebookIds = Array.isArray(body.ebookIds)
      ? body.ebookIds.filter((id): id is string => typeof id === 'string')
      : [];
    if (!orderId || ebookIds.length === 0) {
      sendJson(res, 400, { error: 'INVALID_REGISTRATION' });
      return true;
    }
    registerVerifiedOrder(orderId, ebookIds);
    sendJson(res, 200, { registered: true, orderId });
    return true;
  }

  // --- Entitlement mint (requires the caller's registered verified order) --
  // The request must name the order that purchased the edition — this is the
  // demo's stand-in for "verify the CURRENT USER holds a successful order".
  // Production replaces this with a lookup against the authenticated session.
  if (pathname === '/api/vault/entitlement' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const ebookId = typeof body.ebookId === 'string' ? body.ebookId : '';
    const orderId = typeof body.orderId === 'string' ? body.orderId : '';
    if (!VAULT_ASSETS[ebookId]) {
      sendJson(res, 404, { error: 'VAULT_ASSET_UNKNOWN', ebookId });
      return true;
    }
    const purchasedItems = verifiedOrders.get(orderId);
    if (!orderId || !purchasedItems || !purchasedItems.has(ebookId)) {
      sendJson(res, 403, {
        error: 'NO_VERIFIED_PURCHASE',
        ebookId,
        hint: 'No verified order for this edition is associated with the request.',
      });
      return true;
    }
    const { token, expiresAt } = mintEntitlementToken(ebookId, orderId);
    sendJson(res, 200, { token, expiresAt });
    return true;
  }

  // --- The protected download itself ---------------------------------------
  const downloadMatch = pathname.match(/^\/api\/vault\/download\/([^/]+)$/);
  if (downloadMatch && req.method === 'GET') {
    const ebookId = decodeURIComponent(downloadMatch[1]);
    const token = bearerToken(req);
    if (!token) {
      sendJson(res, 401, { error: 'ENTITLEMENT_TOKEN_REQUIRED', ebookId });
      return true;
    }
    const payload = verifyEntitlementToken(token, ebookId);
    if (!payload) {
      sendJson(res, 403, { error: 'ENTITLEMENT_INVALID', ebookId });
      return true;
    }
    await streamVaultPdf(res, ebookId);
    return true;
  }

  return false;
};

const attachVaultServer = (server: ViteDevServer | PreviewServer) => {
  // Registered BEFORE Vite's internal middlewares: guards /vault/* from the
  // dev server's static file serving and answers /api/vault/*.
  server.middlewares.use((req, res, next) => {
    const pathname = (req.url ?? '').split('?')[0];

    // Hard-block any direct HTTP access to the private vault directory.
    if (pathname === '/vault' || pathname.startsWith('/vault/')) {
      sendJson(res, 403, { error: 'VAULT_DIRECTORY_PRIVATE' });
      return;
    }

    if (pathname.startsWith('/api/vault/')) {
      void handleApiRequest(req, res, pathname).catch(() => {
        if (!res.headersSent) {
          sendJson(res, 500, { error: 'VAULT_SERVER_ERROR' });
        }
      });
      return;
    }

    next();
  });
};

export function zenveroVaultServer(): Plugin {
  // Seed the demo order registry so the storefront's initial "owned library"
  // state (ORD-9482 in INITIAL_ORDERS) can download zv-001. Set
  // ZENVERO_VAULT_DEMO_SEED=0 to boot with an empty registry (production-like).
  if (process.env.ZENVERO_VAULT_DEMO_SEED !== '0') {
    registerVerifiedOrder('ORD-9482', ['zv-001', 'zv-002']);
  }

  return {
    name: 'zenvero-vault-server',
    configureServer: attachVaultServer,
    // Same protection + API when serving the production build via `vite preview`.
    configurePreviewServer: attachVaultServer,
  };
}
