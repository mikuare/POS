# SQLite Runtime Fix Guide (`better-sqlite3`)

This guide fixes:

- `invalid ELF header`
- SQLite not loading
- App falling back to `offline-queue.json`

---

## Why this happens

`better-sqlite3` is a native module.  
It must be built in the same runtime environment where Node runs.

If you install/build in **Windows** but run in **WSL/Linux** (or the reverse), Node cannot load the binary.

---

## Option A: Run in WSL/Linux

Use this if you start app from WSL terminal.

```bash
cd "/mnt/c/Users/edujk/Desktop/POS SYSTEM"
rm -rf node_modules package-lock.json
npm install
npm rebuild better-sqlite3
npm run dev
```

---

## Option B: Run in Windows PowerShell

Use this if you start app from Windows terminal.

```powershell
cd "C:\Users\edujk\Desktop\POS SYSTEM"
rmdir /s /q node_modules
del package-lock.json
npm install
npm rebuild better-sqlite3
npm run dev
```

---

## Rule you must follow

Build dependencies in the same environment where you run Node:

- WSL runtime -> install/rebuild in WSL
- Windows runtime -> install/rebuild in Windows

Do not mix them.

---

## How to verify SQLite is active

1. Start server: `npm run dev`
2. Check logs.

If you see this warning, SQLite is **not** active:

`[LocalDB] better-sqlite3 unavailable. Falling back to file-based offline queue`

If that warning is not shown, SQLite queue is active.

---

## Current fallback behavior

If SQLite fails to load, the app still works:

- Offline queue is stored in `offline-queue.json`
- Sync behavior continues as before

So POS remains functional while you fix runtime mismatch.
