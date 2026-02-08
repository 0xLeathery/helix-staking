'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

// Recharts components use browser APIs (SVG/Canvas) and must be client-side only.
// This wrapper ensures ResponsiveContainer is only rendered on the client.
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

interface ChartWrapperProps {
  children: React.ReactNode;
  height?: number | string;
  className?: string;
}

export function ChartWrapper({
  children,
  height = 350,
  className,
}: ChartWrapperProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div 
        style={{ height }} 
        className={`w-full bg-slate-900/20 animate-pulse rounded-lg ${className}`} 
      />
    );
  }

  return (
    <div style={{ height }} className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        {children as any}
      </ResponsiveContainer>
    </div>
  );
}
