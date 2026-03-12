/**
 * offlineQueue.js
 * Preferred backend: SQLite (`sync_outbox` table via better-sqlite3).
 * Fallback backend: JSON file (`offline-queue.json`) if SQLite is unavailable.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { db } = require('./localDb');

const LEGACY_QUEUE_FILE = path.join(__dirname, '../../../../offline-queue.json');
const SQLITE_READY = Boolean(db);

let insertStmt;
let listStmt;
let removeStmt;
let incrementRetryStmt;
let countStmt;
let clearStmt;

if (SQLITE_READY) {
  insertStmt = db.prepare(`
    INSERT INTO sync_outbox (id, type, payload_json, enqueued_at, retries, last_retry_at)
    VALUES (@id, @type, @payloadJson, @enqueuedAt, @retries, @lastRetryAt)
  `);

  listStmt = db.prepare(`
    SELECT id, type, payload_json, enqueued_at, retries, last_retry_at
    FROM sync_outbox
    ORDER BY enqueued_at ASC
  `);

  removeStmt = db.prepare(`
    DELETE FROM sync_outbox
    WHERE id = ?
  `);

  incrementRetryStmt = db.prepare(`
    UPDATE sync_outbox
    SET retries = retries + 1, last_retry_at = ?
    WHERE id = ?
  `);

  countStmt = db.prepare(`
    SELECT COUNT(*) AS count
    FROM sync_outbox
  `);

  clearStmt = db.prepare(`
    DELETE FROM sync_outbox
  `);
}

function readLegacyQueue() {
  try {
    if (!fs.existsSync(LEGACY_QUEUE_FILE)) return [];
    const raw = fs.readFileSync(LEGACY_QUEUE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_err) {
    return [];
  }
}

function writeLegacyQueue(queue) {
  try {
    fs.writeFileSync(LEGACY_QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
  } catch (err) {
    console.warn('[OfflineQueue] Failed to write queue file:', err.message);
  }
}

function migrateLegacyFileQueueIfNeeded() {
  if (!SQLITE_READY) return;
  try {
    if (!fs.existsSync(LEGACY_QUEUE_FILE)) return;
    const currentCount = getCount();
    if (currentCount > 0) return;

    const legacyOps = readLegacyQueue();
    if (!legacyOps.length) return;

    const insertMany = db.transaction((ops) => {
      ops.forEach((op) => {
        insertStmt.run({
          id: op.id || uuidv4(),
          type: String(op.type || ''),
          payloadJson: JSON.stringify(op.payload || {}),
          enqueuedAt: op.enqueuedAt || new Date().toISOString(),
          retries: Number(op.retries || 0),
          lastRetryAt: op.lastRetryAt || null
        });
      });
    });
    insertMany(legacyOps);

    fs.renameSync(LEGACY_QUEUE_FILE, `${LEGACY_QUEUE_FILE}.migrated`);
    console.log(`[OfflineQueue] Migrated ${legacyOps.length} legacy queued ops into SQLite.`);
  } catch (error) {
    console.warn('[OfflineQueue] Legacy queue migration skipped:', error.message);
  }
}

function enqueue(type, payload) {
  const op = {
    id: uuidv4(),
    type,
    payload,
    enqueuedAt: new Date().toISOString(),
    retries: 0,
    lastRetryAt: null
  };

  if (SQLITE_READY) {
    insertStmt.run({
      id: op.id,
      type: op.type,
      payloadJson: JSON.stringify(op.payload || {}),
      enqueuedAt: op.enqueuedAt,
      retries: op.retries,
      lastRetryAt: op.lastRetryAt
    });
  } else {
    const queue = readLegacyQueue();
    queue.push(op);
    writeLegacyQueue(queue);
  }

  console.log(`[OfflineQueue] Queued operation: ${type} (id=${op.id}). Total pending: ${getCount()}`);
  return op;
}

function getAll() {
  if (SQLITE_READY) {
    const rows = listStmt.all();
    return rows.map((row) => {
      let payload = {};
      try {
        payload = row.payload_json ? JSON.parse(row.payload_json) : {};
      } catch (_err) {
        payload = {};
      }
      return {
        id: row.id,
        type: row.type,
        payload,
        enqueuedAt: row.enqueued_at,
        retries: Number(row.retries || 0),
        lastRetryAt: row.last_retry_at || null
      };
    });
  }

  return readLegacyQueue();
}

function remove(id) {
  if (SQLITE_READY) {
    removeStmt.run(id);
    return;
  }
  const queue = readLegacyQueue().filter((op) => op.id !== id);
  writeLegacyQueue(queue);
}

function incrementRetry(id) {
  if (SQLITE_READY) {
    incrementRetryStmt.run(new Date().toISOString(), id);
    return;
  }
  const queue = readLegacyQueue();
  const op = queue.find((x) => x.id === id);
  if (op) {
    op.retries = (op.retries || 0) + 1;
    op.lastRetryAt = new Date().toISOString();
    writeLegacyQueue(queue);
  }
}

function getCount() {
  if (SQLITE_READY) {
    const row = countStmt.get();
    return Number(row?.count || 0);
  }
  return readLegacyQueue().length;
}

function clear() {
  if (SQLITE_READY) {
    clearStmt.run();
    return;
  }
  writeLegacyQueue([]);
}

module.exports = {
  enqueue,
  getAll,
  remove,
  incrementRetry,
  getCount,
  clear
};

migrateLegacyFileQueueIfNeeded();

/*
 * Original file-only queue approach retained for future reference:
 * - readQueue/writeQueue against offline-queue.json
 * - enqueue/getAll/remove/incrementRetry/getCount/clear using JSON file only
 */
