'use client';

import { useState, useEffect } from 'react';

export function PwaInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setShow(isIOS && !isStandalone);
  }, []);

  if (!show) return null;

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
      <p className="font-medium mb-1">Install HELIX to enable notifications</p>
      <p>
        Tap the <strong>Share</strong> button in Safari, then select{' '}
        <strong>&quot;Add to Home Screen&quot;</strong>. Reopen the app from your home
        screen to receive push notifications.
      </p>
    </div>
  );
}
