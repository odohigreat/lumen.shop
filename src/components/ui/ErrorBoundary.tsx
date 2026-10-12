import { Component, type ReactNode } from 'react';
// Recover render/lazy load failures with a reload action; event/API errors are outside this boundary.
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div role="alert" className="p-8 text-center">
          <h1 className="text-2xl mb-4">This page could not load</h1>
          <p className="mb-4">Try reloading to retrieve the latest version.</p>
          <button className="underline" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    return this.props.children;
  }
}
