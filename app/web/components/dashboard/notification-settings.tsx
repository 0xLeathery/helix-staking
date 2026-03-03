'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { PwaInstallPrompt } from './pwa-install-prompt';
import { api, PushPreferences } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const DEFAULT_PREFERENCES: PushPreferences = {
  notifyMaturity: true,
  notifyLatePenalty: true,
  notifyRewards: true,
  notifyBpd: true,
};

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, disabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2',
          'focus:ring-helix-600 focus:ring-offset-2 focus:ring-offset-zinc-900',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          checked ? 'bg-helix-600' : 'bg-zinc-700',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow',
            'transform transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

export function NotificationSettings() {
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() ?? null;
  const {
    isSupported,
    isSubscribed,
    permission,
    isIOS,
    isStandalone,
    subscribe,
    unsubscribe,
  } = usePushNotifications(wallet);

  const [preferences, setPreferences] = useState<PushPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPreferences = useCallback(async () => {
    if (!isSubscribed) return;
    try {
      setPrefsLoading(true);
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const prefs = await api.getPushPreferences(sub.endpoint);
        setPreferences(prefs);
      }
    } catch {
      // Silently fail — defaults are fine
    } finally {
      setPrefsLoading(false);
    }
  }, [isSubscribed]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await subscribe();
    } catch (err) {
      toast({
        title: 'Failed to enable notifications',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      await unsubscribe();
    } catch (err) {
      toast({
        title: 'Failed to disable notifications',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof PushPreferences, newValue: boolean) => {
    const previous = preferences[key];
    // Optimistic update
    setPreferences((prev) => ({ ...prev, [key]: newValue }));
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) throw new Error('No active subscription');
      await api.setPushPreferences(sub.endpoint, { [key]: newValue });
    } catch (err) {
      // Revert on error
      setPreferences((prev) => ({ ...prev, [key]: previous }));
      toast({
        title: 'Failed to save preference',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Push Notifications</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Receive browser push notifications for important staking events.
        </p>
      </div>

      {!isSupported && (
        <p className="text-sm text-zinc-400">
          Your browser does not support push notifications.
        </p>
      )}

      {isSupported && isIOS && !isStandalone && <PwaInstallPrompt />}

      {isSupported && permission === 'denied' && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          Notifications are blocked. Please enable them in your browser settings.
        </div>
      )}

      {isSupported && permission !== 'denied' && (
        <div>
          {!isSubscribed ? (
            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-helix-600 hover:bg-helix-700 text-white"
            >
              {loading ? 'Enabling...' : 'Enable Notifications'}
            </Button>
          ) : (
            <Button
              onClick={handleUnsubscribe}
              disabled={loading}
              variant="destructive"
            >
              {loading ? 'Disabling...' : 'Disable Notifications'}
            </Button>
          )}
        </div>
      )}

      {isSubscribed && (
        <div className="border-t border-zinc-800 pt-4 space-y-0 divide-y divide-zinc-800">
          <ToggleRow
            label="Stake Maturity"
            description="Get notified 7 days before your stake matures"
            checked={preferences.notifyMaturity}
            disabled={prefsLoading}
            onChange={(v) => handleToggle('notifyMaturity', v)}
          />
          <ToggleRow
            label="Late Penalty Warning"
            description="Get notified when your stake enters the late penalty window"
            checked={preferences.notifyLatePenalty}
            disabled={prefsLoading}
            onChange={(v) => handleToggle('notifyLatePenalty', v)}
          />
          <ToggleRow
            label="Rewards Available"
            description="Get notified when new staking rewards are distributed"
            checked={preferences.notifyRewards}
            disabled={prefsLoading}
            onChange={(v) => handleToggle('notifyRewards', v)}
          />
          <ToggleRow
            label="Big Pay Day"
            description="Get notified on BPD phase transitions"
            checked={preferences.notifyBpd}
            disabled={prefsLoading}
            onChange={(v) => handleToggle('notifyBpd', v)}
          />
        </div>
      )}
    </div>
  );
}
