import '@testing-library/jest-dom';

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
