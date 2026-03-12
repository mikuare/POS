(function attachOfflineOutbox(global) {
  const DB_NAME = 'pos-offline-db';
  const DB_VERSION = 5;
  const STORE_NAME = 'cash_sales_outbox';
  const LEGACY_STORE_NAME = 'cash_sales_transactions';
  const FALLBACK_KEY = 'pos-offline-outbox-v1';

  let fallbackMigrationDone = false;
  let legacyMigrationDone = false;

  function log(level, message, data) {
    const fn = console[level] || console.log;
    if (typeof data === 'undefined') {
      fn(`[POS-OfflineDexie] ${message}`);
      return;
    }
    fn(`[POS-OfflineDexie] ${message}`, data);
  }

  function randomId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return `offline-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  function readFallbackQueue() {
    try {
      const raw = global.localStorage ? global.localStorage.getItem(FALLBACK_KEY) : null;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function writeFallbackQueue(queue) {
    if (!global.localStorage) return;
    global.localStorage.setItem(FALLBACK_KEY, JSON.stringify(Array.isArray(queue) ? queue : []));
  }

  function dedupeAndSort(ops) {
    const map = new Map();
    (Array.isArray(ops) ? ops : []).forEach((op) => {
      if (!op || !op.id) return;
      map.set(String(op.id), op);
    });
    return Array.from(map.values()).sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
  }

  function createDexieDb() {
    if (!global.Dexie) {
      return null;
    }

    const db = new global.Dexie(DB_NAME);
    db.version(DB_VERSION).stores({
      [STORE_NAME]: 'id, createdAt',
      [LEGACY_STORE_NAME]: 'id, createdAt'
    });
    return db;
  }

  const db = createDexieDb();

  async function withDexieOrThrow() {
    if (!db) {
      throw new Error('Dexie is unavailable in this browser runtime.');
    }
    if (!db.isOpen()) {
      await db.open();
    }
    return db;
  }

  async function migrateFallbackToDexieIfPossible() {
    if (fallbackMigrationDone) return;

    const fallbackOps = readFallbackQueue();
    if (!fallbackOps.length) {
      fallbackMigrationDone = true;
      return;
    }

    if (!db) {
      return;
    }

    try {
      const localDb = await withDexieOrThrow();
      await localDb.transaction('rw', localDb[STORE_NAME], async () => {
        for (const op of fallbackOps) {
          if (!op || !op.id) continue;
          await localDb[STORE_NAME].put(op);
        }
      });
      writeFallbackQueue([]);
      fallbackMigrationDone = true;
      log('info', 'Migrated fallback queue into Dexie.', { count: fallbackOps.length });
    } catch (error) {
      log('warn', 'Fallback->Dexie migration skipped (will retry later).', error && error.message ? error.message : error);
    }
  }

  function normalizeOperationShape(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const payload = raw.payload && typeof raw.payload === 'object'
      ? raw.payload
      : {
          invoiceId: raw.invoiceId || '',
          reference: raw.reference || '',
          createdAt: raw.createdAt || new Date().toISOString(),
          items: Array.isArray(raw.items) ? raw.items : []
        };
    const normalized = {
      id: String(raw.id || raw.operationId || randomId()),
      type: String(raw.type || 'cash_sale'),
      payload,
      invoiceId: String(raw.invoiceId || payload.invoiceId || ''),
      reference: String(raw.reference || payload.reference || ''),
      totalAmount: Number(raw.totalAmount || payload.totalAmount || payload.total || 0),
      amountTendered: Number(raw.amountTendered || payload.amountTendered || 0),
      itemCount: Number(raw.itemCount || payload.itemCount || (Array.isArray(payload.items) ? payload.items.length : 0)),
      totalQty: Number(raw.totalQty || payload.totalQty || 0),
      orderType: String(raw.orderType || payload.orderType || 'dine-in'),
      status: String(raw.status || 'pending'),
      syncSource: String(raw.syncSource || 'client_offline'),
      lastError: raw.lastError || null,
      createdAt: String(raw.createdAt || payload.createdAt || new Date().toISOString()),
      syncedAt: raw.syncedAt || null,
      serverInvoiceId: raw.serverInvoiceId || null,
      serverReference: raw.serverReference || null,
      retries: Number(raw.retries || 0),
      lastRetryAt: raw.lastRetryAt || null
    };
    return normalized;
  }

  function isPendingCashSale(raw) {
    const op = normalizeOperationShape(raw);
    if (!op) return false;
    const type = String(op.type || '').toLowerCase();
    if (type && type !== 'cash_sale') return false;
    const status = String(op.status || '').toLowerCase();
    if (status === 'synced' || status === 'done' || status === 'completed') return false;
    return true;
  }

  async function migrateLegacyStoreToOutboxIfPossible() {
    if (legacyMigrationDone || !db) return;

    try {
      const localDb = await withDexieOrThrow();
      const outboxTable = localDb.tables.find((t) => t.name === STORE_NAME);
      const legacyTable = localDb.tables.find((t) => t.name === LEGACY_STORE_NAME);
      if (!outboxTable || !legacyTable) {
        legacyMigrationDone = true;
        return;
      }

      const legacyRows = await legacyTable.toArray();
      if (!Array.isArray(legacyRows) || !legacyRows.length) {
        legacyMigrationDone = true;
        return;
      }

      let moved = 0;
      await localDb.transaction('rw', outboxTable, legacyTable, async () => {
        for (const row of legacyRows) {
          if (!isPendingCashSale(row)) continue;
          const normalized = normalizeOperationShape(row);
          if (!normalized || !normalized.id) continue;
          await outboxTable.put(normalized);
          await legacyTable.delete(String(row.id || normalized.id));
          moved += 1;
        }
      });

      legacyMigrationDone = true;
      if (moved > 0) {
        log('info', 'Migrated legacy IndexedDB outbox records.', { moved, from: LEGACY_STORE_NAME, to: STORE_NAME });
      }
    } catch (error) {
      log('warn', 'Legacy outbox migration skipped (will retry later).', error && error.message ? error.message : error);
    }
  }

  async function enqueueCashSale(payload) {
    await migrateFallbackToDexieIfPossible();
    await migrateLegacyStoreToOutboxIfPossible();

    const now = new Date().toISOString();
    const op = {
      id: String((payload && payload.operationId) || randomId()),
      type: 'cash_sale',
      payload: payload || {},
      invoiceId: String((payload && payload.invoiceId) || ''),
      reference: String((payload && payload.reference) || ''),
      totalAmount: Number((payload && payload.totalAmount) || 0),
      amountTendered: Number((payload && payload.amountTendered) || 0),
      itemCount: Number((payload && payload.itemCount) || 0),
      totalQty: Number((payload && payload.totalQty) || 0),
      orderType: String((payload && payload.orderType) || 'dine-in'),
      status: 'pending',
      syncSource: 'client_offline',
      lastError: null,
      createdAt: String((payload && payload.createdAt) || now),
      syncedAt: null,
      serverInvoiceId: null,
      serverReference: null,
      retries: 0,
      lastRetryAt: null
    };

    try {
      const localDb = await withDexieOrThrow();
      await localDb.transaction('rw', localDb[STORE_NAME], async () => {
        await localDb[STORE_NAME].put(op);
      });
      log('info', 'Queued offline cash sale in IndexedDB.', {
        id: op.id,
        invoiceId: op.invoiceId,
        reference: op.reference,
        totalAmount: op.totalAmount,
        itemCount: op.itemCount,
        status: op.status
      });
      return op;
    } catch (error) {
      const queue = readFallbackQueue();
      queue.push(op);
      writeFallbackQueue(dedupeAndSort(queue));
      log('warn', 'Dexie enqueue failed, used localStorage fallback.', error && error.message ? error.message : error);
      return op;
    }
  }

  async function listPendingSales() {
    await migrateFallbackToDexieIfPossible();
    await migrateLegacyStoreToOutboxIfPossible();

    const rows = [];
    try {
      if (db) {
        const localDb = await withDexieOrThrow();
        const outboxTable = localDb.tables.find((t) => t.name === STORE_NAME);
        if (outboxTable) {
          rows.push.apply(rows, await outboxTable.toArray());
        }
        const legacyTable = localDb.tables.find((t) => t.name === LEGACY_STORE_NAME);
        if (legacyTable) {
          rows.push.apply(rows, await legacyTable.toArray());
        }
      }
    } catch (error) {
      log('warn', 'Dexie read failed for pending sales.', error && error.message ? error.message : error);
    }

    const fallbackRows = readFallbackQueue();
    return dedupeAndSort(
      rows
        .concat(fallbackRows)
        .filter(isPendingCashSale)
        .map(normalizeOperationShape)
        .filter(Boolean)
    );
  }

  async function listTransactions() {
    // Keeping API shape for compatibility; history store is removed by design.
    return [];
  }

  async function listPendingTransactionsFromHistory() {
    const all = await listTransactions();
    return all.filter((row) => String((row && row.status) || '').toLowerCase() === 'pending');
  }

  async function removeSale(operationId, syncMeta = null) {
    await migrateFallbackToDexieIfPossible();
    if (!operationId) return;
    const syncInfo = syncMeta && typeof syncMeta === 'object' ? syncMeta : {};
    const syncedAt = new Date().toISOString();

    try {
      if (db) {
        const localDb = await withDexieOrThrow();
        await localDb.transaction('rw', localDb[STORE_NAME], async () => {
          await localDb[STORE_NAME].delete(operationId);
        });
      }
    } catch (error) {
      log('warn', 'Dexie remove failed; continuing fallback cleanup.', error && error.message ? error.message : error);
    }

    const queue = readFallbackQueue().filter((op) => String((op && op.id) || '') !== String(operationId));
    writeFallbackQueue(queue);
    log('info', 'Offline cash sale synced and removed from outbox.', {
      id: operationId,
      serverInvoiceId: syncInfo.serverInvoiceId || null,
      serverReference: syncInfo.serverReference || null,
      syncedAt
    });
  }

  async function incrementRetry(operationId, options = null) {
    await migrateFallbackToDexieIfPossible();
    if (!operationId) return;
    const errorMessage = options && options.errorMessage ? String(options.errorMessage) : null;

    try {
      if (db) {
        const localDb = await withDexieOrThrow();
        await localDb.transaction('rw', localDb[STORE_NAME], async () => {
          const op = await localDb[STORE_NAME].get(operationId);
          if (op) {
            op.retries = Number(op.retries || 0) + 1;
            op.lastRetryAt = new Date().toISOString();
            op.status = 'failed';
            op.lastError = errorMessage;
            await localDb[STORE_NAME].put(op);
          }
        });
      }
    } catch (error) {
      log('warn', 'Dexie retry update failed; continuing fallback update.', error && error.message ? error.message : error);
    }

    const queue = readFallbackQueue();
    const target = queue.find((op) => String((op && op.id) || '') === String(operationId));
    if (target) {
      target.retries = Number(target.retries || 0) + 1;
      target.lastRetryAt = new Date().toISOString();
      target.status = 'failed';
      target.lastError = errorMessage;
      writeFallbackQueue(queue);
    }
    log('warn', 'Offline cash sale sync retry incremented.', {
      id: operationId,
      error: errorMessage
    });
  }

  async function getSummary() {
    const pending = await listPendingSales().catch(() => []);

    const invoices = new Set();
    pending.forEach((op) => {
      const invoiceId = (op && op.payload && op.payload.invoiceId) || op.invoiceId;
      if (invoiceId) invoices.add(String(invoiceId));
    });

    return {
      operations: pending.length,
      invoices: invoices.size
    };
  }

  async function getDiagnostics() {
    const fallback = readFallbackQueue();
    const diagnostics = {
      backend: db ? 'Dexie(IndexedDB)' : 'Fallback(localStorage)',
      indexedDbReady: false,
      fallbackCount: Array.isArray(fallback) ? fallback.length : 0,
      objectStores: [STORE_NAME],
      dbName: DB_NAME,
      dbVersion: DB_VERSION,
      timestamp: new Date().toISOString()
    };

    if (!db) {
      return diagnostics;
    }

    try {
      const localDb = await withDexieOrThrow();
      diagnostics.indexedDbReady = true;
      diagnostics.backend = 'Dexie(IndexedDB)';
      diagnostics.objectStores = localDb.tables.map((t) => t.name);
    } catch (error) {
      diagnostics.indexedDbReady = false;
      diagnostics.backend = 'Fallback(localStorage)';
      diagnostics.error = error && error.message ? error.message : String(error);
    }

    return diagnostics;
  }

  async function debugGetAllData() {
    const result = {
      outbox: [],
      transactions: [],
      fallback: readFallbackQueue(),
      diagnostics: null
    };

    try {
      if (db) {
        const localDb = await withDexieOrThrow();
        result.outbox = await localDb[STORE_NAME].toArray();
      }
    } catch (_error) {
      // Best-effort debug data.
    }

    result.outbox = dedupeAndSort(result.outbox);
    result.transactions = dedupeAndSort(result.transactions);
    result.diagnostics = await getDiagnostics();
    return result;
  }

  global.POSOfflineOutbox = {
    enqueueCashSale,
    listPendingSales,
    listTransactions,
    removeSale,
    incrementRetry,
    getSummary,
    getDiagnostics,
    debugGetAllData,
    _constants: {
      DB_NAME,
      DB_VERSION,
      STORE_NAME,
      FALLBACK_KEY
    }
  };
  global.POSOfflineDebug = {
    dump: debugGetAllData,
    listPendingSales,
    listTransactions,
    getSummary,
    getDiagnostics
  };

  log('info', 'POSOfflineOutbox initialized.', {
    backend: db ? 'Dexie(IndexedDB)' : 'Fallback(localStorage)',
    dbName: DB_NAME,
    version: DB_VERSION
  });

  setTimeout(function initDiagnostics() {
    getDiagnostics().catch(function noop() {});
  }, 1000);
})(window);
