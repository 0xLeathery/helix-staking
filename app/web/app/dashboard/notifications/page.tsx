import { NotificationSettings } from '@/components/dashboard/notification-settings';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Notifications</h1>
        <p className="text-zinc-400 mt-1">
          Manage push notification preferences for your HELIX staking activity.
        </p>
      </div>
      <NotificationSettings />
    </div>
  );
}
