import '@testing-library/jest-dom';
import React from 'react';

// Polyfill Buffer for @solana/buffer-layout in jsdom environment
import { Buffer } from 'buffer';
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

// Mock next/navigation for components using useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link for components using Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    const React = require('react');
    return React.createElement('a', { href, ...props }, children);
  },
}));

// Mock Solana wallet adapter
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({ publicKey: null, connected: false, connect: vi.fn(), disconnect: vi.fn(), signTransaction: vi.fn() }),
  useConnection: () => ({ connection: { onAccountChange: vi.fn(() => 1), removeAccountChangeListener: vi.fn(), simulateTransaction: vi.fn(), getTokenAccountBalance: vi.fn() } }),
}));

// Mock Framer Motion to prevent animation-related test timeouts
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    LazyMotion: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    MotionConfig: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    m: new Proxy({} as typeof actual.m, {
      get(_: unknown, key: string) {
        return React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }, ref: React.Ref<HTMLElement>) =>
          React.createElement(key, { ...props, ref }, children)
        );
      },
    }),
    motion: new Proxy({} as typeof actual.motion, {
      get(_: unknown, key: string) {
        if (key === 'create') {
          return (_tag: string) => React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }, ref: React.Ref<HTMLElement>) =>
            React.createElement(_tag, { ...props, ref }, children)
          );
        }
        return React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }, ref: React.Ref<HTMLElement>) =>
          React.createElement(key, { ...props, ref }, children)
        );
      },
    }),
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => true,
    useReducedMotion: () => false,
  };
});
