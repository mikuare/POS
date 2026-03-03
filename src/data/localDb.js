const path = require('path');
let db = null;
let dbError = null;

const sqliteDisabled =
  process.env.POS_DISABLE_SQLITE === '1' ||
  process.env.VERCEL === '1';

try {
  // SQLite is for persistent local/server runtimes only. In serverless (Vercel),
  // this module is intentionally disabled and offline queue falls back elsewhere.
  if (!sqliteDisabled) {
    const Database = require('better-sqlite3');
    const DB_FILE = process.env.POS_LOCAL_DB_FILE
      ? path.resolve(process.env.POS_LOCAL_DB_FILE)
      : path.join(__dirname, '../../pos-local.db');

    db = new Database(DB_FILE);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('foreign_keys = ON');

    db.exec(`
    CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      enqueued_at TEXT NOT NULL,
      retries INTEGER NOT NULL DEFAULT 0,
      last_retry_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_sync_outbox_enqueued_at
    ON sync_outbox(enqueued_at ASC);
    `);
  }
} catch (error) {
  dbError = error;
  console.warn('[LocalDB] better-sqlite3 unavailable. Falling back to file-based offline queue:', error.message);
}

if (sqliteDisabled) {
  dbError = new Error('SQLite disabled for this runtime');
  console.log('[LocalDB] SQLite disabled. Using file-based offline queue.');
}

module.exports = {
  db,
  dbError
};
