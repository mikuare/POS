(function attachOfflineOutbox(global) {
  // Browser-side offline queue for installed/live PWA clients.
  // Data is stored per device/browser profile via IndexedDB.
  const DB_NAME = 'pos-offline-db';
  const DB_VERSION = 1;
  const STORE_NAME = 'cash_sales_outbox';

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        reject(new Error('IndexedDB is unavailable in this browser.'));
        return;
      }

      const request = global.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
    });
  }

  async function withStore(mode, fn) {
    const db = await openDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);

        Promise.resolve(fn(store, tx)).then(resolve).catch(reject);

        tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'));
      });
    } finally {
      db.close();
    }
  }

  function randomId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return `offline-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  function readAll(store, indexName) {
    return new Promise((resolve, reject) => {
      const source = indexName ? store.index(indexName) : store;
      const req = source.getAll();
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => reject(req.error || new Error('IndexedDB read failed'));
    });
  }

  function putRecord(store, value) {
    return new Promise((resolve, reject) => {
      const req = store.put(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IndexedDB write failed'));
    });
  }

  function deleteRecord(store, key) {
    return new Promise((resolve, reject) => {
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error('IndexedDB delete failed'));
    });
  }

  async function enqueueCashSale(payload) {
    const now = new Date().toISOString();
    const op = {
      id: String(payload?.operationId || randomId()),
      type: 'cash_sale',
      payload,
      createdAt: String(payload?.createdAt || now),
      retries: 0,
      lastRetryAt: null
    };

    await withStore('readwrite', (store) => putRecord(store, op));
    return op;
  }

  async function listPendingSales() {
    const rows = [];
    await withStore('readonly', async (store) => {
      const all = await readAll(store, 'createdAt');
      all.forEach((row) => {
        if (row && row.type === 'cash_sale') rows.push(row);
      });
    });
    return rows.sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
  }

  async function removeSale(operationId) {
    if (!operationId) return;
    await withStore('readwrite', (store) => deleteRecord(store, operationId));
  }

  async function incrementRetry(operationId) {
    if (!operationId) return;
    await withStore('readwrite', async (store) => {
      const all = await readAll(store);
      const op = all.find((x) => x && x.id === operationId);
      if (!op) return;
      op.retries = Number(op.retries || 0) + 1;
      op.lastRetryAt = new Date().toISOString();
      await putRecord(store, op);
    });
  }

  async function getSummary() {
    const pending = await listPendingSales();
    const invoices = new Set();
    pending.forEach((op) => {
      const invoiceId = op?.payload?.invoiceId;
      if (invoiceId) invoices.add(String(invoiceId));
    });

    return {
      operations: pending.length,
      invoices: invoices.size
    };
  }

  global.POSOfflineOutbox = {
    enqueueCashSale,
    listPendingSales,
    removeSale,
    incrementRetry,
    getSummary
  };
})(window);
