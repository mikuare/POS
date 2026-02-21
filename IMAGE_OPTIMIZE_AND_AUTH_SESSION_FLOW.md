# Image Optimization + Login/Logout Session Flow

This guide explains two things:

1. How product images are made faster to display automatically in the UI.
2. Where login/logout/session performance logic lives in code, and how it was implemented.

## 1) Image Optimization and Auto-Fast Display

## What is already implemented in UI

The frontend now avoids re-creating image elements on every category switch.

- Preload all product images once in background:
  - `public/app.js:971` (`preloadProductImages`)
- Build product cards once, then show/hide by category:
  - `public/app.js:1004` (`renderProducts`)
  - `public/app.js:1051` (`switchCategory`)
- Use lazy decoding/loading on `<img>` tags:
  - `public/app.js:1019` (`loading="lazy" decoding="async"`)

Result: switching menu categories is much smoother because images are not repeatedly recreated.

## Recommended automatic file optimization (for source images)

Your current `.png` files are large (many are 2MB+). For best speed, convert product images to WebP/AVIF and resize before deployment.

Suggested target:

- Max width: `1200px` (or lower if POS display is smaller)
- Format: `webp`
- Quality: `70-80`

Example workflow:

1. Install an optimizer tool (`sharp`, `squoosh`, or ImageMagick).
2. Batch-convert all files under `public/Main Dish`, `public/Burger`, etc.
3. Replace product paths in `src/data/store.js` to use optimized files.

If you want, we can add a script like `npm run optimize:images` so this is one command only.

## 2) Login/Logout/Session Speed Improvements

## Client-side flow (instant UX)

### Logout now updates UI immediately

- Function: `public/app.js:482` (`handleLogout`)
- How it works:
  - Clears UI/session state first (instant response)
  - Sends `/api/auth/logout` in background (non-blocking)

### Login/Signup submit busy states

- Login handler: `public/app.js:581`
- Signup handler: `public/app.js:624`
- Busy helper: `public/app.js:563`
- What changed:
  - Prevents double submit
  - Shows immediate button feedback (`Signing in...`, `Creating account...`)

### Session restore on startup feels faster

- Bootstrap: `public/app.js:830`
- What changed:
  - App unlocks quickly for remembered session
  - Token verification (`/api/auth/session`) continues in background

## Server-side flow (reduced auth response time)

### Login endpoint critical-path reduction

- Login route: `src/server.js:427`
- Non-critical work moved to background:
  - Audit logs via `runInBackground(...)`
  - `last_login_at` update via `runInBackground(...)`
  - Related lines: `src/server.js:441`, `src/server.js:471`, `src/server.js:481`, `src/server.js:486`

### Short-lived app user cache

- Cache config: `src/server.js:66`
- Cache helpers:
  - `src/server.js:93` (`runInBackground`)
  - `src/server.js:153` (`getAppUserById` now checks cache first)
- Purpose:
  - Reduce repeated DB profile lookups during auth/session checks

### Session endpoint

- Route: `src/server.js:512` (`/api/auth/session`)
- Uses `getAppUserById`, which now benefits from cache.

### Logout endpoint

- Route: `src/server.js:551` (`/api/auth/logout`)
- Kept simple: audit log + success response.

## Quick Summary

- Category image lag was fixed in frontend rendering strategy.
- Login/logout smoothness was fixed in frontend UX flow.
- Actual auth response speed was improved in backend by removing non-critical waits and adding short cache.
