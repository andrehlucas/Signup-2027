'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  CreditCard,
  User,
  Phone,
  MapPin,
  Bell,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { useToast } from '@/app/hooks/use-toast';
import { NotificationPreferences } from '../../../shared/schema';

const categorySettings = [
  {
    key: 'mailEnabled' as const,
    label: 'Mail Notifications',
    description: 'Get notified when you receive new mail at any of your office locations.',
    icon: Mail,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    key: 'billingEnabled' as const,
    label: 'Billing & Payments',
    description: 'Receive alerts about invoices, payment confirmations, and subscription changes.',
    icon: CreditCard,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    key: 'accountEnabled' as const,
    label: 'Account Activity',
    description: 'Stay informed about login activity, password changes, and security alerts.',
    icon: User,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    key: 'serviceEnabled' as const,
    label: 'Service Updates',
    description: 'Notifications about your phone system, call forwarding, and add-on activations.',
    icon: Phone,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    key: 'locationEnabled' as const,
    label: 'Location Updates',
    description: 'Updates about new locations, address changes, and office availability.',
    icon: MapPin,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
];

const deliverySettings = [
  {
    key: 'inAppDelivery' as const,
    label: 'In-App Notifications',
    description: 'Show notifications within the portal when you log in.',
    icon: Monitor,
  },
  {
    key: 'emailDelivery' as const,
    label: 'Email Notifications',
    description: 'Send notification summaries to your registered email address.',
    icon: Smartphone,
  },
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
      <div className="p-4 lg:p-8 max-w-4xl">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="w-10 h-5 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-alerts-title">
          Alerts & Preferences
        </h1>
        <p className="text-sm text-gray-500 mt-1" data-testid="text-alerts-subtitle">
          Choose which notifications you receive and how they are delivered.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2" data-testid="text-categories-heading">
          <Bell className="h-5 w-5 text-gray-500" />
          Notification Categories
        </h2>
        <div className="space-y-3">
          {categorySettings.map((setting) => {
            const Icon = setting.icon;
            const isEnabled = preferences?.[setting.key] ?? true;
            return (
              <div
                key={setting.key}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 transition-all hover:shadow-sm"
                data-testid={`card-preference-${setting.key}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${setting.bgColor}`}>
                  <Icon className={`h-5 w-5 ${setting.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium text-gray-900 cursor-pointer" data-testid={`text-preference-label-${setting.key}`}>
                    {setting.label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
                </div>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2" data-testid="text-delivery-heading">
          <Smartphone className="h-5 w-5 text-gray-500" />
          Delivery Method
        </h2>
        <div className="space-y-3">
          {deliverySettings.map((setting) => {
            const Icon = setting.icon;
            const isEnabled = preferences?.[setting.key] ?? true;
            return (
              <div
                key={setting.key}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 transition-all hover:shadow-sm"
                data-testid={`card-delivery-${setting.key}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium text-gray-900 cursor-pointer" data-testid={`text-delivery-label-${setting.key}`}>
                    {setting.label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
                </div>
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
