import { useState, useEffect } from 'react';
import { z } from 'zod';
import { X, Check } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(5, "Valid zip code required"),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

export function CheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment (Mock), 3: Success
  const [formData, setFormData] = useState<Partial<CheckoutData>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const { cartTotal, clearCart } = useCartStore();
  const { closeCart } = useUIStore();

  useEffect(() => {
    const handleOpen = () => {
      closeCart();
      setIsOpen(true);
      setStep(1);
    };
    window.addEventListener('open-checkout', handleOpen);
    return () => window.removeEventListener('open-checkout', handleOpen);
  }, [closeCart]);

  if (!isOpen) return null;

  const handleNext = () => {
    try {
      if (step === 1) {
        checkoutSchema.parse(formData);
        setErrors({});
        setStep(2);
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: any = {};
        e.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate transaction
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setStep(3);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity duration-300" onClick={() => step !== 3 && setIsOpen(false)} />

      <div className="relative w-full max-w-2xl bg-surface shadow-2xl p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300 ease-out">
        {step !== 3 && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold tracking-tight mb-2">Shipping Details</h2>
              <p className="text-muted">Enter your delivery information</p>
            </div>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName || ''}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  value={formData.lastName || ''}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  error={errors.lastName}
                />
              </div>
              <Input
                label="Address"
                value={formData.address || ''}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={formData.city || ''}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  error={errors.city}
                />
                <Input
                  label="Zip Code"
                  value={formData.zipCode || ''}
                  onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                  error={errors.zipCode}
                />
              </div>
            </div>
            <Button className="w-full h-14" size="lg" onClick={handleNext}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-serif font-bold tracking-tight mb-2">Payment</h2>
              <p className="text-muted">Secure checkout simulation</p>
            </div>

            <div className="p-6 border border-border bg-secondary/50 space-y-4">
              <div className="flex justify-between font-medium">
                <span>Total to Pay:</span>
                <span className="font-serif">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted">
                This is a sandbox environment. No actual payment will be processed.
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="h-14 px-8" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1 h-14" size="lg" isLoading={isProcessing} onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 scale-in">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-tight">Order Confirmed</h2>
            <p className="text-muted max-w-sm mx-auto text-balance">
              Thank you for your purchase. We'll send a confirmation email with your order details shortly.
            </p>
            <Button className="mt-8 px-12 h-14" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
