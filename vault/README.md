# ZenVero Private Vault

This directory is **private storage for paid edition PDFs**. It sits outside
`public/`, is **never copied into the build output** (`dist/`), and the dev /
preview server **hard-blocks all HTTP access** to `/vault/*`
(see `plugins/vaultServer.ts` and the `server.fs.deny` rule in `vite.config.ts`).

The only way file bytes leave this directory is through:

```
POST /api/vault/entitlement        { ebookId, orderId }  -> signed token
GET  /api/vault/download/:ebookId  (Bearer token)        -> PDF bytes
```

The mint step verifies that the specific registered order purchased the
specific edition before issuing a token; the download step verifies the
token's HMAC signature before streaming. In production, the order must come
from the authenticated session (see PRODUCTION SEAM in `plugins/vaultServer.ts`)
rather than a client-supplied order id.

## Where to put the real PDF

| ebook id | Edition | Drop the file here | User receives |
|---|---|---|---|
| `zv-001` | The Calm Compounding Operator | `vault/ebooks/calm-compounding-operator-v4.pdf` | `ZenVero-The-Calm-Compounding-Operator.pdf` |

The filename on disk matches the catalog's vault key
(`vault://zenvero-editions/calm-compounding-operator-v4.pdf` →
`vault/ebooks/calm-compounding-operator-v4.pdf`).

Until the real PDF is placed at that path, a verified purchase download
responds with HTTP 404 `VAULT_ASSET_MISSING` and the UI shows
"Vault asset not provisioned yet".

## Git policy

Paid PDFs are **git-ignored** (see `.gitignore`) so the paid asset is never
accidentally published through the repository. Keep production files in real
private object storage instead.

## Security honest-notice

This vault server is **demo-grade**. It runs inside the Vite dev/preview
server because this project has no standalone backend. Entitlement tokens are
HMAC-signed with a server-only secret, but purchase "verification" is a
demo stand-in (see the PRODUCTION SEAM notes in `plugins/vaultServer.ts`).
Do not treat this as production security.
