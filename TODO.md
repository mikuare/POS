# Offline Support Implementation TODO

## Plan Summary
Enable the POS system to work offline (no internet) with Supabase sync when internet returns.

## Steps

- [ ] 1. Create `src/data/offlineQueue.js` — file-based JSON queue for pending Supabase operations
- [ ] 2. Modify `src/data/store.js` — wrap Supabase calls with try-catch + offline queue fallback; add syncOfflineQueue()
- [ ] 3. Modify `src/server.js` — add /api/connectivity, /api/sync/trigger endpoints; fix offline auth; periodic auto-sync
- [ ] 4. Modify `public/index.html` — add #offlineBanner element
- [ ] 5. Modify `public/styles.css` — add offline banner styles
- [ ] 6. Modify `public/app.js` — offline detection, banner, session fix, disable e-wallet offline, enable scan QR offline, sync toast

## Offline Behavior Rules
- ✅ Browse menu (cached catalog)
- ✅ Add orders to cart
- ✅ Cash payments (in-memory, queued for sync)
- ✅ Scan QR to Pay (manual flow, no internet needed)
- ✅ Print receipts
- ✅ View sales report (in-memory fallback)
- ✅ Stay logged in (cached session)
- ✅ Login attempt shows helpful offline error message
- ❌ GCash/PayMaya e-wallet — buttons DISABLED with message when offline
- ✅ Auto-sync when internet returns with toast notification
