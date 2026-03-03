# Offline Storage Integration Guide (SQLite + IndexedDB)

Use this pattern when building another POS with both local-server and PWA offline support.

## Quick Rule

- `SQLite` is for your Node server runtime (local machine, VM, dedicated server).
- `IndexedDB` is for browser/PWA clients (offline transactions per device).
- In `Vercel serverless`, do not depend on SQLite for durable runtime data.

## Where Data Goes

### 1. Local development (`npm run dev`, `localhost:4000`)

- Server code can use `better-sqlite3` and write to `pos-local.db`.
- Useful for local queue persistence, testing fallback behavior, and debugging.

### 2. Live deployed PWA (installed on client device)

- Offline sales are stored in browser `IndexedDB`.
- In this project:
  - DB name: `pos-offline-db`
  - Store: `cash_sales_outbox`
  - Script: `public/offline-outbox.js`
- Data is isolated per browser profile/device.

## Current Architecture in This Project

### Server-side storage switch

File: `src/data/localDb.js`

- SQLite is disabled when:
  - `process.env.VERCEL === '1'`, or
  - `process.env.POS_DISABLE_SQLITE === '1'`
- This prevents native module/runtime failures in serverless.

### Client-side offline queue

File: `public/offline-outbox.js`

- Uses IndexedDB to:
  - enqueue offline cash sale operations
  - list pending operations
  - remove synced operations
  - increment retry counters

### Sync flow

File: `public/app.js`

1. Cash checkout fails due to network -> `queueOfflineCashSale(...)`
2. Sale is saved to IndexedDB
3. Connectivity monitor calls `syncClientOfflineOutbox(...)` when online
4. App replays each pending sale to:
   - `POST /api/invoices`
   - `POST /api/payments/cash`
5. Synced items are removed from IndexedDB queue

## How to Reuse in Another POS

1. Add browser queue module (IndexedDB)
- Create a file like `offline-outbox.js` with `enqueue/list/remove/incrementRetry/getSummary`.

2. Hook offline fallback into checkout
- For cash or allowed methods, catch network failures and queue operation locally.

3. Add background sync trigger
- On interval and `window.online` events, replay queued operations to API.

4. Keep idempotent server API contracts
- Pass `clientInvoiceId` and/or `clientReference` so retries do not duplicate sales.

5. Show pending queue in UI
- Display pending count and list of unsynced operations to operators.

6. Keep SQLite optional in serverless
- Guard native DB init with runtime checks to avoid deployment crashes.

## Inspecting Offline Data

### SQLite (local server only)

- Open `pos-local.db` in DB Browser for SQLite.
- You will only see local server writes, not client device IndexedDB data.

### IndexedDB (client device/browser)

1. Open Chrome DevTools
2. Go to `Application`
3. Open `IndexedDB`
4. Inspect `pos-offline-db` -> `cash_sales_outbox`

## Recommended Production Notes

- IndexedDB offline queue is per device; it is not shared automatically between devices.
- Use cloud DB (Supabase/Postgres) as source of truth after sync.
- Keep sync operations idempotent and retry-safe.
- Keep PWA app shell cached (service worker) so UI loads without internet.
