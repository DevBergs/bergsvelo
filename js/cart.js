/**
 * BERGSVELO — Cart Store
 * Manages shopping cart state via localStorage.
 * Loaded on ALL pages to keep the nav badge in sync.
 */

(function () {
  const STORAGE_KEY = 'bergsvelo_cart';

  // ── Store ─────────────────────────────────────────────────
  const CartStore = {
    _data: [],

    _load() {
      try {
        this._data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        this._data = [];
      }
    },

    _save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
    },

    items() {
      return this._data;
    },

    count() {
      return this._data.reduce((sum, i) => sum + i.qty, 0);
    },

    total() {
      return this._data.reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    add(item) {
      // item: { id, type, title, price, meta? }
      const existing = this._data.find(i => i.id === item.id && i.type === item.type);
      if (existing) {
        existing.qty += 1;
      } else {
        this._data.push({ ...item, qty: 1 });
      }
      this._save();
      this._emit();
    },

    remove(id, type) {
      this._data = this._data.filter(i => !(i.id === id && i.type === type));
      this._save();
      this._emit();
    },

    setQty(id, type, qty) {
      const item = this._data.find(i => i.id === id && i.type === type);
      if (!item) return;
      if (qty < 1) {
        this.remove(id, type);
        return;
      }
      item.qty = qty;
      this._save();
      this._emit();
    },

    clear() {
      this._data = [];
      this._save();
      this._emit();
    },

    _listeners: [],

    onChange(fn) {
      this._listeners.push(fn);
    },

    _emit() {
      this._listeners.forEach(fn => fn());
    },
  };

  CartStore._load();

  // ── Badge ─────────────────────────────────────────────────
  function updateBadge() {
    const count = CartStore.count();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count > 0 ? count : '';
      el.dataset.count = count;
    });
  }

  CartStore.onChange(updateBadge);

  // Run once on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBadge);
  } else {
    updateBadge();
  }

  // ── Nav cart click ────────────────────────────────────────
  // On non-shop pages: navigate to shop.html
  // On shop.html: open the drawer (handled by shop.html inline script)
  document.addEventListener('DOMContentLoaded', () => {
    const isShopPage = document.body.dataset.page === 'shop';

    document.querySelectorAll('.nav-cart').forEach(btn => {
      if (!isShopPage) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = 'shop.html';
        });
      }
      // shop.html sets its own click handler via data-page="shop"
    });
  });

  // Expose globally so shop.html inline script can use it
  window.CartStore = CartStore;
})();
