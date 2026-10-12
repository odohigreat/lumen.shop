import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlay } from '../../hooks/useOverlay';

export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useOverlay(true, onClose);

  // Step changes may remove the focused input/button. Focus the updated dialog so
  // keyboard users stay inside it and assistive technology can announce its title.
  useEffect(() => {
    ref.current?.focus();
  }, [title, ref]);

  // Rendering outside main allows the overlay hook to exclude the whole page,
  // including when a product page opens its size guide.
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative bg-surface p-6 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-serif">{title}</h2>
          <button className="p-3" onClick={onClose} aria-label={`Close ${title}`}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
