import { useState, type FormEvent } from 'react';
import {
  deliverySchema,
  calculateShipping,
  type DeliveryData,
  type ShippingMethod,
} from './checkout';
import { useCartStore, selectCartTotal } from '../../store/useCartStore';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils';
const fields: { key: keyof DeliveryData; label: string; autoComplete: string }[] = [
  { key: 'email', label: 'Email', autoComplete: 'email' },
  { key: 'firstName', label: 'First name', autoComplete: 'given-name' },
  { key: 'lastName', label: 'Last name', autoComplete: 'family-name' },
  { key: 'address', label: 'Address', autoComplete: 'street-address' },
  { key: 'city', label: 'City', autoComplete: 'address-level2' },
  { key: 'country', label: 'Country', autoComplete: 'country-name' },
  { key: 'postalCode', label: 'Postal code (optional)', autoComplete: 'postal-code' },
];
export function CheckoutModal({ onClose }: { onClose: () => void }) {
  // Entry ,review, completion. No step creates an order or clears the cart.
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<DeliveryData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryData, string>>>({});
  const [shipping, setShipping] = useState<ShippingMethod>('standard');
  const total = useCartStore(selectCartTotal);
  const items = useCartStore((s) => s.items);
  const persistenceIssue = useCartStore((s) => s.persistenceIssue);
  // Illustrative rates only; there is no destination aware shipping/tax service.
  const shippingCost = calculateShipping(total, shipping);
  const handleReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = deliverySchema.safeParse(data);
    if (!result.success) {
      // Zod field paths map into the same typed keys used to render the inputs.
      const next: Partial<Record<keyof DeliveryData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string' && field in data)
          next[field as keyof DeliveryData] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setData(result.data); // Review displays the trimmed values that passed validation.
    setStep(2);
  };

  return (
    <Dialog
      title={
        step === 1 ? 'Shipping preview' : step === 2 ? 'Review demo checkout' : 'Preview complete'
      }
      onClose={onClose}
    >
      <p className="text-muted mb-6">
        Frontend demo. Details stay in this preview; no payment, order, or email is sent. Shipping
        estimates are illustrative.
      </p>
      {!items.length ? (
        <p>Your cart is empty. Add a piece before previewing checkout.</p>
      ) : step === 1 ? (
        <form onSubmit={handleReview} className="space-y-4">
          {fields.map((field) => (
            <Input
              key={field.key}
              label={field.label}
              type={field.key === 'email' ? 'email' : 'text'}
              autoComplete={field.autoComplete}
              required={field.key !== 'postalCode'}
              value={data[field.key]}
              error={errors[field.key]}
              onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
            />
          ))}
          <label className="block">
            Shipping estimate
            <select
              className="block border border-border p-3 w-full mt-2"
              value={shipping}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'standard' || value === 'express') setShipping(value);
              }}
            >
              <option value="standard">
                Standard · 3–5 business days · {total > 200 ? 'Free' : '$8'}
              </option>
              <option value="express">Express · 1–2 business days · $25</option>
            </select>
          </label>
          <Button type="submit" className="w-full">
            Review checkout
          </Button>
        </form>
      ) : step === 2 ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Delivery details</h3>
            <p>
              {data.firstName} {data.lastName}
              <br />
              {data.address}
              <br />
              {data.city}, {data.country} {data.postalCode}
            </p>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.product.name} · {item.variant.color}/{item.variant.size} × {item.quantity}
                </span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 border-t border-border pt-4">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Estimated shipping</dt>
              <dd>{formatCurrency(shippingCost)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Taxes / duties</dt>
              <dd>Not calculated in demo</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>Estimate before taxes</dt>
              <dd>{formatCurrency(total + shippingCost)}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Edit details
            </Button>
            <Button onClick={() => setStep(3)}>Complete preview</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p>
            No order was placed.{' '}
            {persistenceIssue
              ? 'Your cart remains available in this session; browser storage has not been confirmed.'
              : 'Your cart is saved so you can continue exploring.'}
          </p>
          <Button onClick={onClose}>Continue shopping</Button>
        </div>
      )}
    </Dialog>
  );
}
