import { useEffect, useRef } from 'react';

// Reference-count scroll locks so overlapping overlay lifecycles do not unlock early.
let locks = 0;
let previousOverflow = '';
export function useOverlay(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep the latest callback without resetting focus and scroll locks on each render.
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const returnFocus = document.activeElement as HTMLElement | null;
    if (locks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    const root = ref.current;
    const background = [...document.querySelectorAll<HTMLElement>('header, main, footer')].filter(
      (el) => !el.contains(root),
    );
    // Restore existing inert values rather than assuming every element was interactive.
    const previousInert = background.map((el) => el.inert);
    background.forEach((el) => {
      el.inert = true;
    });
    // Re-query on Tab: checkout steps can replace the controls while the dialog stays open.
    const focusables = () =>
      [
        ...(root?.querySelectorAll<HTMLElement>(
          'a[href],button:not(:disabled),input:not(:disabled),select,textarea,[tabindex="0"]',
        ) ?? []),
      ].filter((el) => el.getClientRects().length);
    (focusables()[0] ?? root)?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close.current();
      }
      if (event.key !== 'Tab') return;
      const elements = focusables();
      const first = elements[0],
        last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        root?.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first || !root?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !root?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    const resize = () => {
      if (root?.id === 'mobile-menu' && desktop.matches) close.current();
    };
    desktop.addEventListener('change', resize);
    document.addEventListener('keydown', keydown);
    return () => {
      desktop.removeEventListener('change', resize);
      document.removeEventListener('keydown', keydown);
      background.forEach((el, i) => {
        el.inert = previousInert[i];
      });
      if (--locks === 0) document.body.style.overflow = previousOverflow;
      if (
        returnFocus?.isConnected &&
        !returnFocus.closest('[inert]') &&
        !returnFocus.matches(':disabled')
      )
        returnFocus.focus();
      else document.querySelector<HTMLElement>('header button[aria-label^="Open cart"]')?.focus();
    };
  }, [open]);
  return ref;
}
