import assert from 'node:assert/strict';
import test from 'node:test';
import { createCartStore, selectCartCount, selectCartTotal } from '../src/store/useCartStore.ts';
import { MOCK_PRODUCTS } from '../src/data/mockData.ts';

const key = 'dtc-cart-storage';
const product = MOCK_PRODUCTS[0];
const [variant, secondVariant, unavailableVariant] = product.variants;
const lineId = `${product.id}-${variant.id}`;

function setup(saved) {
  const disk = new Map(saved === undefined ? [] : [[key, saved]]);
  const failures = { access: false, read: false, write: false, remove: false };
  const storage = {
    getItem(name) {
      if (failures.read) throw new Error('Storage read denied');
      return disk.get(name) ?? null;
    },
    setItem(name, value) {
      if (failures.write) throw new Error('Storage quota exceeded');
      disk.set(name, value);
    },
    removeItem(name) {
      if (failures.remove) throw new Error('Storage removal denied');
      disk.delete(name);
    },
  };
  const provider = () => {
    if (failures.access) throw new Error('Storage access denied');
    return storage;
  };
  return { disk, failures, provider, store: createCartStore(provider) };
}
const saved = (items) => JSON.stringify({ state: { items }, version: 0 });
const record = (quantity = 1, overrides = {}) => ({ product, variant, quantity, ...overrides });

test('additions derive totals and respect per-variant stock', () => {
  const { store } = setup();
  store.getState().addItem(product, variant);
  assert.equal(selectCartTotal(store.getState()), 495);
  store.getState().addItem(product, variant, 20);
  assert.equal(store.getState().items[0].quantity, variant.inventory);
  assert.equal(selectCartCount(store.getState()), variant.inventory);
  store.getState().updateQuantity(lineId, 2);
  assert.equal(selectCartTotal(store.getState()), 990);
  store.getState().updateQuantity(lineId, 99);
  assert.equal(store.getState().items[0].quantity, variant.inventory);
});

test('different variants remain separate lines; removal and clear update totals', () => {
  const { store } = setup();
  store.getState().addItem(product, variant, 2);
  store.getState().addItem(product, secondVariant, 3);
  assert.equal(store.getState().items.length, 2);
  assert.equal(selectCartCount(store.getState()), 5);
  store.getState().removeItem(lineId);
  assert.equal(store.getState().items[0].variant.id, secondVariant.id);
  assert.equal(selectCartTotal(store.getState()), 1485);
  store.getState().clearCart();
  assert.equal(selectCartTotal(store.getState()), 0);
});

test('invalid quantities and unavailable variants cannot alter cart lines', () => {
  const { store } = setup();
  store.getState().addItem(product, variant, 2);
  for (const value of [0, -1, NaN, Infinity, 1.5]) {
    store.getState().addItem(product, variant, value);
    store.getState().updateQuantity(lineId, value);
  }
  store.getState().addItem(product, unavailableVariant);
  store.getState().updateQuantity('missing', 4);
  assert.equal(store.getState().items.length, 1);
  assert.equal(store.getState().items[0].quantity, 2);
});

test('normal persistence saves only items and restores on a fresh store', () => {
  const { store, disk, provider } = setup();
  store.getState().addItem(product, variant, 2);
  assert.deepEqual(Object.keys(JSON.parse(disk.get(key)).state), ['items']);
  const restored = createCartStore(provider);
  assert.equal(selectCartTotal(restored.getState()), 990);
  assert.equal(restored.getState().persistenceIssue, null);
});

test('restoration uses current prices and stock, merging duplicate variants', () => {
  const { store } = setup(
    saved([
      record(4, {
        product: { id: product.id, price: 1 },
        variant: { id: variant.id, inventory: 999 },
      }),
      record(4),
    ]),
  );
  assert.equal(store.getState().items.length, 1);
  assert.equal(store.getState().items[0].quantity, variant.inventory);
  assert.equal(selectCartTotal(store.getState()), 2475);
  assert.equal(store.getState().persistenceIssue, null);
});

test('invalid records are discarded, valid lines survive, and recovery is disclosed', () => {
  const { store, disk } = setup(
    saved([
      record(2),
      null,
      7,
      [],
      { product: null, variant: {} },
      record(-1),
      record(1.5),
      record(1, { product: { id: 'missing' } }),
      record(1, { variant: { id: 'missing' } }),
      record(1, { variant: unavailableVariant }),
    ]),
  );
  assert.equal(store.getState().items.length, 1);
  assert.equal(store.getState().items[0].quantity, 2);
  assert.equal(store.getState().persistenceIssue, 'corrupt');
  store.getState().retryPersistence();
  assert.equal(store.getState().persistenceIssue, null);
  assert.equal(JSON.parse(disk.get(key)).state.items.length, 1);
});

test('corrupt JSON and unsupported envelopes keep a usable cart without deleting storage', () => {
  for (const input of [
    '{broken',
    'null',
    '7',
    '{}',
    saved(null),
    saved({}),
    JSON.stringify({ state: { items: [] }, version: 99 }),
  ]) {
    const { store, disk } = setup(input);
    assert.deepEqual(store.getState().items, []);
    assert.equal(store.getState().persistenceIssue, 'corrupt');
    assert.equal(disk.get(key), input);
    assert.doesNotThrow(() => store.getState().addItem(product, variant));
    assert.equal(store.getState().persistenceIssue, 'corrupt');
    store.getState().retryPersistence();
    assert.equal(store.getState().persistenceIssue, null);
    assert.equal(JSON.parse(disk.get(key)).state.items.length, 1);
  }
});

test('permission failure on storage access does not prevent in-memory mutations', () => {
  const context = setup();
  context.failures.access = true;
  const store = createCartStore(context.provider);
  assert.equal(store.getState().persistenceIssue, 'unavailable');
  assert.doesNotThrow(() => store.getState().addItem(product, variant, 2));
  store.getState().updateQuantity(lineId, 3);
  assert.equal(selectCartCount(store.getState()), 3);
  store.getState().removeItem(lineId);
  assert.equal(selectCartCount(store.getState()), 0);
});

test('failed initial read can retry and recover an existing saved cart', () => {
  const context = setup(saved([record(3)]));
  context.failures.read = true;
  const store = createCartStore(context.provider);
  assert.equal(store.getState().persistenceIssue, 'unavailable');
  context.failures.read = false;
  store.getState().retryPersistence();
  assert.equal(selectCartCount(store.getState()), 3);
  assert.equal(store.getState().persistenceIssue, null);
});

test('failed writes preserve memory and retry saves newer changes rather than stale disk', async () => {
  const { store, disk, failures } = setup(saved([record(1)]));
  failures.write = true;
  assert.doesNotThrow(() => store.getState().addItem(product, variant, 2));
  store.getState().addItem(product, secondVariant, 2);
  assert.equal(store.getState().persistenceIssue, 'unavailable');
  assert.equal(JSON.parse(disk.get(key)).state.items[0].quantity, 1);
  await store.persist.rehydrate();
  assert.equal(selectCartCount(store.getState()), 5);
  assert.equal(store.getState().persistenceIssue, 'unavailable');
  failures.write = false;
  store.getState().retryPersistence();
  assert.equal(store.getState().persistenceIssue, null);
  const restored = createCartStore(() => ({
    getItem: (name) => disk.get(name) ?? null,
    setItem: (name, value) => disk.set(name, value),
    removeItem: (name) => disk.delete(name),
  }));
  assert.equal(selectCartCount(restored.getState()), 5);
  assert.equal(restored.getState().items.length, 2);
});

test('failed clear persists the empty memory cart on recovery', () => {
  const { store, disk, failures } = setup(saved([record(2)]));
  failures.write = true;
  store.getState().clearCart();
  assert.equal(selectCartCount(store.getState()), 0);
  assert.equal(store.getState().persistenceIssue, 'unavailable');
  failures.write = false;
  store.getState().retryPersistence();
  assert.deepEqual(JSON.parse(disk.get(key)).state.items, []);
});

test('a later successful cart mutation also recovers persistence', () => {
  const { store, disk, failures } = setup();
  failures.write = true;
  store.getState().addItem(product, variant);
  failures.write = false;
  store.getState().updateQuantity(lineId, 2);
  assert.equal(store.getState().persistenceIssue, null);
  assert.equal(JSON.parse(disk.get(key)).state.items[0].quantity, 2);
});

test('remove-storage failures are contained and disclosed', () => {
  const { store, failures } = setup(saved([record()]));
  failures.remove = true;
  assert.doesNotThrow(() => store.persist.clearStorage());
  assert.equal(store.getState().persistenceIssue, 'unavailable');
});

// Adding a new item must not hide the warning before the shopper opens the cart.
test('restoration warnings survive successful mutations until explicitly acknowledged', () => {
  const { store, disk } = setup(saved([record(1), { product: { id: 'missing' } }]));
  store.getState().addItem(product, secondVariant);
  assert.equal(store.getState().persistenceIssue, 'corrupt');
  assert.equal(JSON.parse(disk.get(key)).state.items.length, 2);
  store.getState().retryPersistence();
  assert.equal(store.getState().persistenceIssue, null);
});
