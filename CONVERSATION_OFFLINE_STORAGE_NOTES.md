# Conversation Notes: Vercel Crash, Offline PWA, SQLite vs IndexedDB

Date: March 3, 2026

This file saves the key parts of our conversation and outcomes.

## 1. Initial Production Issue

You reported:

- Vercel live URL showed `500: INTERNAL_SERVER_ERROR`
- `FUNCTION_INVOCATION_FAILED`

What was fixed:

- Updated Vercel routing config so static files resolve correctly.
- Made SQLite init runtime-safe for Vercel serverless (`VERCEL=1` disables SQLite and uses fallback).

Files changed:

- `vercel.json`
- `src/data/localDb.js`

## 2. Offline Behavior Clarification

Your question:

- Why offline says server unreachable
- Why SQLite DB Browser does not show offline live transactions

Clarification:

- Local SQLite (`pos-local.db`) is for local server runtime (`npm run dev` / localhost).
- Live installed PWA offline transactions are stored in browser storage (`IndexedDB`) on that device.
- On reconnect, client sync sends queued records to live API.

## 3. UI Improvements Added

### A. Better offline status text

Changed message from “Cannot reach local POS server” to cloud-accurate messaging.

File:

- `public/app.js`

### B. Offline Transactions panel

Added visible panel in app:

- “Offline Transactions (This Device)”
- Shows pending offline records from IndexedDB queue.

Files:

- `public/index.html`
- `public/styles.css`
- `public/app.js`

## 4. IndexedDB Payload Enhancements

You requested more visible fields in IndexedDB records.

Added in each queued offline sale `payload`:

- `items[].qty` (existing)
- `totalQty`
- `subtotalAmount`
- `totalAmount`
- `itemCount`
- `productNames`

File:

- `public/app.js`

## 5. Documentation Added

Created reusable integration guide:

- `OFFLINE_STORAGE_INTEGRATION_GUIDE.md`

Guide covers:

- SQLite vs IndexedDB roles
- Serverless constraints
- Sync flow pattern
- Reuse steps for future POS projects

README updated to link guide:

- `README.md`

## 6. Code Comments Added

Added comments at key storage flow points:

- `src/data/localDb.js`
- `public/offline-outbox.js`
- `public/app.js`

## 7. Quick Q&A Saved

### Q: Is SQLite DB Browser for local testing only?
Yes. For this architecture, SQLite file is mainly local/server runtime storage.

### Q: In live installed PWA, where does offline data go?
IndexedDB in that device/browser profile.

### Q: Do I need extra software to inspect IndexedDB?
No. Use browser DevTools (`F12`) -> `Application` -> `IndexedDB`.

### Q: What is `payload`?
The transaction content object inside each offline queue record.

### Q: What does `queued` mean?
Saved and waiting for later sync/processing.

## 8. Important Operational Note

IndexedDB is per-device and per-browser profile.  
If multiple devices are used offline, each has its own local queue until synced.
