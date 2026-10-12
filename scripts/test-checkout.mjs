import assert from 'node:assert/strict';
import test from 'node:test';
import { deliverySchema, calculateShipping } from '../src/components/checkout/checkout.ts';

const delivery = {
  email: ' shopper@example.com ',
  firstName: ' Demo ',
  lastName: ' Shopper ',
  address: ' 123 Demo Road ',
  city: ' Lagos ',
  country: ' Nigeria ',
  postalCode: '',
};

test('delivery validation trims fields and accepts an optional postal code', () => {
  const parsed = deliverySchema.parse(delivery);
  assert.equal(parsed.email, 'shopper@example.com');
  assert.equal(parsed.firstName, 'Demo');
  assert.equal(parsed.address, '123 Demo Road');
  assert.equal(parsed.country, 'Nigeria');
  assert.equal(parsed.postalCode, '');
});

test('delivery rejects malformed email, blank required fields, and short addresses', () => {
  for (const field of ['email', 'firstName', 'lastName', 'address', 'city', 'country']) {
    const result = deliverySchema.safeParse({ ...delivery, [field]: '   ' });
    assert.equal(result.success, false, field);
    assert(result.error.issues.some((issue) => issue.path[0] === field));
  }
  assert.equal(deliverySchema.safeParse({ ...delivery, email: 'invalid' }).success, false);
  assert.equal(deliverySchema.safeParse({ ...delivery, address: 'ab' }).success, false);
  assert.equal(deliverySchema.safeParse({ ...delivery, firstName: 123 }).success, false);
});

test('shipping preserves the above-$200 standard threshold and flat express rate', () => {
  assert.equal(calculateShipping(0, 'standard'), 8);
  assert.equal(calculateShipping(199.99, 'standard'), 8);
  assert.equal(calculateShipping(200, 'standard'), 8);
  assert.equal(calculateShipping(200.01, 'standard'), 0);
  assert.equal(calculateShipping(495, 'standard'), 0);
  for (const total of [0, 199.99, 200, 200.01, 495]) {
    assert.equal(calculateShipping(total, 'express'), 25);
  }
});
