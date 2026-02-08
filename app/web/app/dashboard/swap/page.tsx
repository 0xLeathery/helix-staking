'use client';

import * as React from 'react';
import { JupiterWidget } from '@/components/swap/JupiterWidget';

export default function SwapPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-zinc-100">Swap</h1>
        <p className="text-zinc-400">Acquire HELIX or exit positions via Jupiter.</p>
      </div>

      <div className="flex justify-center">
        <JupiterWidget />
      </div>
    </div>
  );
}
