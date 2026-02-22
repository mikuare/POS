# Catalog Local Cache Guide

## Purpose
This document explains the local catalog cache added to reduce first-screen loading delay in the Product Dashboard (menu categories + product list), especially when data grows.

## Problem
Without cache, first load depends on network/API speed:
- fetch `/api/products`
- parse large payload (many categories/products)
- render UI

When catalog is large, users see blank/white area while waiting.

## Implemented Solution
The frontend now uses a **3-level startup source**:

1. User-specific local cache (`localStorage`)
2. Global local cache (`localStorage`) shared in the same browser
3. Built-in fallback catalog (hardcoded defaults)

Then it always refreshes from backend in the background and updates UI.

## Keys Used
- User cache key: `pos_catalog_cache_v1_<userId|email|guest>`
- Global cache key: `pos_catalog_cache_v1_global`

## Startup Flow
1. App boot starts.
2. Try `readCatalogCache()` from user key.
3. If missing, try global key.
4. If still missing, load `BOOTSTRAP_CATALOG_FALLBACK`.
5. Immediately render categories/products from available local data.
6. Call backend (`/api/products`) in background.
7. Replace UI with fresh server data.
8. Save new snapshot to both user key and global key.

Result: UI is usable immediately, then silently syncs.

## Core Functions
In `public/app.js`:
- `readCatalogCache()`
- `writeCatalogCache(payload)`
- `getBootstrapCatalogFallback()`
- `hydrateCatalogState(cached, { keepCategory })`
- `refreshCatalog({ keepCategory })`

## Why This Helps with Large Data
- Removes hard dependency on network for initial paint.
- Prevents white/blank panel on first interaction.
- Reduces perceived latency.
- Keeps app interactive while server fetch continues.

## Tradeoffs
- Cached data can be briefly stale.
- Background sync is required to guarantee freshness.

This is acceptable for POS browse UX as long as writes (add/edit/delete) still hit backend and trigger refresh.

## Recommended for Bigger Catalogs
If catalog keeps growing, add these next:

1. Pagination or category-lazy-load from API
2. Image thumbnails + WebP/AVIF
3. CDN caching for images
4. Versioned catalog cache (invalidate by `catalog_version`)
5. IndexedDB for very large datasets (instead of localStorage)

## Operational Notes
- After deployment, do a hard refresh once to install latest JS.
- Cache auto-updates on successful `/api/products` response.
- If needed during debugging, clear:
  - `pos_catalog_cache_v1_*`
  - `pos_catalog_cache_v1_global`

