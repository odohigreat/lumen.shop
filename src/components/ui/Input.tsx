import { forwardRef } from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold tracking-wide text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'flex h-12 w-full border border-border bg-transparent px-4 py-2 text-base text-primary transition-colors duration-300 ease-out',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted focus:outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:border-error',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-error mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
