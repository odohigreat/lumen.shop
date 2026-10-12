import { z } from 'zod';

// Validate delivery details before review. This demo does not collect payment details.
export const deliverySchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  firstName: z.string().trim().min(1, 'Enter your first name'),
  lastName: z.string().trim().min(1, 'Enter your last name'),
  address: z.string().trim().min(3, 'Enter your address'),
  city: z.string().trim().min(1, 'Enter your city'),
  country: z.string().trim().min(1, 'Enter your country'),
  postalCode: z.string().trim(),
});
// Infer form types from the runtime schema to keep the two definitions aligned.
export type DeliveryData = z.infer<typeof deliverySchema>;

export type ShippingMethod = 'standard' | 'express';

// Demo rates: free standard shipping starts above $200, not at exactly $200.
export function calculateShipping(subtotal: number, method: ShippingMethod): number {
  return method === 'express' ? 25 : subtotal > 200 ? 0 : 8;
}
