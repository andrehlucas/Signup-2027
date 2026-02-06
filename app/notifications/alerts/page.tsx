'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  CreditCard,
  User,
  Phone,
  MapPin,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { Switch } from '@/app/components/ui/switch';
import { useToast } from '@/app/hooks/use-toast';
import { NotificationPreferences } from '../../../shared/schema';

const categorySettings = [
  { key: 'mailEnabled' as const, label: 'Mail', icon: Mail },
  { key: 'billingEnabled' as const, label: 'Billing & Payments', icon: CreditCard },
  { key: 'accountEnabled' as const, label: 'Account Activity', icon: User },
  { key: 'serviceEnabled' as const, label: 'Service Updates', icon: Phone },
  { key: 'locationEnabled' as const, label: 'Location Updates', icon: MapPin },
];

const deliverySettings = [
  { key: 'inAppDelivery' as const, label: 'In-App', icon: Monitor },
  { key: 'emailDelivery' as const, label: 'Email', icon: Smartphone },
];

export default function NotificationsAlertsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery<NotificationPreferences>({
    queryKey: ['/api/notification-preferences'],
    queryFn: async () => {
      const res = await fetch('/api/notification-preferences');
      if (!res.ok) throw new Error('Failed to fetch preferences');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      const res = await fetch('/api/notification-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update preferences');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-preferences'] });
      toast({ title: 'Preferences updated' });
    },
  });

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    updateMutation.mutate({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 max-w-3xl">
        <div className="h-6 bg-gray-100 rounded w-40 animate-pulse mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-3 animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full" />
              <div className="h-3.5 bg-gray-100 rounded w-1/3 flex-1" />
              <div className="w-9 h-5 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-1" data-testid="text-alerts-title">
        Alerts & Preferences
      </h1>
      <p className="text-sm text-gray-500 mb-6" data-testid="text-alerts-subtitle">
        Choose which notifications you receive.
      </p>

      <div className="mb-8">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3" data-testid="text-categories-heading">
          Categories
        </h2>
        <div className="divide-y divide-gray-100">
          {categorySettings.map((setting) => {
            const Icon = setting.icon;
            const isEnabled = preferences?.[setting.key] ?? true;
            return (
              <div
                key={setting.key}
                className="py-3 flex items-center gap-3"
                data-testid={`card-preference-${setting.key}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-800 flex-1" data-testid={`text-preference-label-${setting.key}`}>
                  {setting.label}
                </span>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleToggle(setting.key, checked)}
                  disabled={updateMutation.isPending}
                  data-testid={`switch-${setting.key}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3" data-testid="text-delivery-heading">
          Delivery
        </h2>
        <div className="divide-y divide-gray-100">
          {deliverySettings.map((setting) => {
            const Icon = setting.icon;
            const isEnabled = preferences?.[setting.key] ?? true;
            return (
              <div
                key={setting.key}
                className="py-3 flex items-center gap-3"
                data-testid={`card-delivery-${setting.key}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-800 flex-1" data-testid={`text-delivery-label-${setting.key}`}>
                  {setting.label}
                </span>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleToggle(setting.key, checked)}
                  disabled={updateMutation.isPending}
                  data-testid={`switch-${setting.key}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
