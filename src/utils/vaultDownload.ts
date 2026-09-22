/**
 * ZenVero Secure Vault Download (client side)
 * ===========================================
 * Download flow for vault-protected editions (currently zv-001,
 * "The Calm Compounding Operator"). This service NEVER reads
 * `ebook.pdfFile` and NEVER links to a public/static PDF path.
 *
 * Flow (per download click — no persisted credentials):
 *   1. POST /api/vault/entitlement  { ebookId, orderId }
 *      -> the server verifies THAT registered order purchased THIS edition
 *         and mints a short-lived HMAC-signed entitlement token.
 *   2. GET  /api/vault/download/:ebookId  (Bearer token)
 *      -> the server verifies the signature BEFORE streaming the PDF bytes.
 *   3. The response blob is saved locally under the official filename.
 *
 * PRODUCTION SEAM: in production, steps 1/2 must be answered by a real
 * backend that derives the order from the *authenticated user session*
 * (never from a client-supplied orderId alone — see plugins/vaultServer.ts).
 * The client contract (mint -> authorized fetch -> blob download) is shaped
 * so only the server side needs to change.
 */

export interface VaultProtectedDownload {
  /** Filename the user receives (server sends the same Content-Disposition). */
  downloadFilename: string;
}

/**
 * Editions whose PDFs are served exclusively through the vault endpoint.
 * Everything else keeps its existing download behavior.
 */
export const VAULT_PROTECTED_DOWNLOADS: Record<string, VaultProtectedDownload> =
  {
    'zv-001': {
      downloadFilename: 'ZenVero-The-Calm-Compounding-Operator.pdf',
    },
  };

export const isVaultProtected = (ebookId: string): boolean =>
  Object.prototype.hasOwnProperty.call(VAULT_PROTECTED_DOWNLOADS, ebookId);

export type VaultDownloadOutcome =
  | 'ok' // signed, verified, file streaming to the user
  | 'denied' // server refused: no verified purchase / invalid entitlement
  | 'unavailable' // verified, but the PDF is not provisioned on the server
  | 'error'; // network/protocol failure

interface MintResponse {
  token?: string;
  expiresAt?: number;
}

const mintEntitlement = async (
  ebookId: string,
  orderId: string
): Promise<string | null> => {
  try {
    const res = await fetch('/api/vault/entitlement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ebookId, orderId }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as MintResponse;
    return data.token ?? null;
  } catch {
    return null;
  }
};

const fetchPdfBlob = async (
  ebookId: string,
  token: string
): Promise<{ ok: true; blob: Blob } | { ok: false; outcome: VaultDownloadOutcome }> => {
  let res: Response;
  try {
    res = await fetch(`/api/vault/download/${encodeURIComponent(ebookId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { ok: false, outcome: 'error' };
  }

  if (res.ok) {
    try {
      return { ok: true, blob: await res.blob() };
    } catch {
      return { ok: false, outcome: 'error' };
    }
  }

  let code = '';
  try {
    code = ((await res.json()) as { error?: string }).error ?? '';
  } catch {
    /* non-JSON error body */
  }
  if (res.status === 401 || res.status === 403) {
    return { ok: false, outcome: 'denied' };
  }
  if (res.status === 404 && code === 'VAULT_ASSET_MISSING') {
    return { ok: false, outcome: 'unavailable' };
  }
  return { ok: false, outcome: 'error' };
};

const saveBlobAsFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Requests the protected PDF for a vault edition. `orderId` must identify the
 * verified order that purchased this edition (in production the backend
 * derives it from the authenticated session instead). Returns what happened
 * so the UI can surface the right message. The server verifies the signed
 * entitlement before a single byte of the PDF is exposed.
 */
export const requestVaultDownload = async (
  ebookId: string,
  orderId: string
): Promise<VaultDownloadOutcome> => {
  const config = VAULT_PROTECTED_DOWNLOADS[ebookId];
  if (!config || !orderId) return 'denied';

  const token = await mintEntitlement(ebookId, orderId);
  if (!token) return 'denied';

  const result = await fetchPdfBlob(ebookId, token);
  if (!result.ok) return result.outcome;

  saveBlobAsFile(result.blob, config.downloadFilename);
  return 'ok';
};

/**
 * DEMO stand-in for the payment provider webhook: after the demo checkout
 * marks an order as Verified, tell the vault server so it accepts that order
 * in entitlement requests. Production replaces the server side of this call
 * with real payment verification; the client call site stays.
 */
export const registerVerifiedOrder = async (
  orderId: string,
  ebookIds: string[]
): Promise<void> => {
  try {
    await fetch('/api/vault/verified-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, ebookIds }),
    });
  } catch {
    /* demo server unreachable (e.g. static deployment) — handled at download */
  }
};
