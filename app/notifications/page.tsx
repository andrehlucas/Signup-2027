'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Mail,
  CreditCard,
  User,
  Phone,
  MapPin,
  CheckCheck,
  Bell,
  Trash2,
  Circle,
  Monitor,
  Smartphone,
  Settings2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { useToast } from '@/app/hooks/use-toast';
import { Notification, NotificationPreferences } from '../../shared/schema';

const typeIcons: Record<string, typeof Mail> = {
  mail: Mail,
  billing: CreditCard,
  account: User,
  service: Phone,
  location: MapPin,
};

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

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  const { data: notifications, isLoading: loadingNotifications } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', filterType],
    queryFn: async () => {
      const url = filterType === 'all' ? '/api/notifications' : `/api/notifications?type=${filterType}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
  });

  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ['/api/notifications/unread-count'],
    queryFn: async () => {
      const res = await fetch('/api/notifications/unread-count');
      if (!res.ok) throw new Error('Failed to fetch unread count');
      return res.json();
    },
  });

  const { data: preferences, isLoading: loadingPreferences } = useQuery<NotificationPreferences>({
    queryKey: ['/api/notification-preferences'],
    queryFn: async () => {
      const res = await fetch('/api/notification-preferences');
      if (!res.ok) throw new Error('Failed to fetch preferences');
      return res.json();
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark notification as read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications/read-all', { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark all as read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      toast({ title: 'All notifications marked as read' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete notification');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      toast({ title: 'Notification removed' });
    },
  });

  const updatePrefMutation = useMutation({
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    updatePrefMutation.mutate({ [key]: value });
  };

  const filteredNotifications = notifications?.filter(n => {
    if (filterRead === 'unread') return !n.isRead;
    if (filterRead === 'read') return n.isRead;
    return true;
  });

  const unreadCount = unreadData?.count ?? 0;

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900" data-testid="text-notifications-title">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 mt-0.5" data-testid="text-notifications-subtitle">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              className="text-gray-500"
              data-testid="button-mark-all-read"
            >
              <CheckCheck className="h-4 w-4 mr-1.5" />
              Mark all read
            </Button>
          </div>

          <div className="flex gap-2 mb-5">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-8 text-sm" data-testid="select-filter-type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mail">Mail</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRead} onValueChange={setFilterRead}>
              <SelectTrigger className="w-[140px] h-8 text-sm" data-testid="select-filter-read">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="divide-y divide-gray-100">
            {loadingNotifications ? (
              <div className="space-y-0 divide-y divide-gray-100">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="py-3 animate-pulse flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications && filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Mail;
                return (
                  <div
                    key={notification.id}
                    className={`py-3 flex items-start gap-3 cursor-pointer group ${
                      !notification.isRead ? 'bg-gray-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                    data-testid={`card-notification-${notification.id}`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {!notification.isRead && (
                          <Circle className="h-1.5 w-1.5 fill-gray-900 text-gray-900 shrink-0" data-testid={`icon-unread-${notification.id}`} />
                        )}
                        <span
                          className={`text-sm truncate ${notification.isRead ? 'text-gray-600' : 'font-medium text-gray-900'}`}
                          data-testid={`text-notification-title-${notification.id}`}
                        >
                          {notification.title}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0 ml-auto" data-testid={`text-notification-time-${notification.id}`}>
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1" data-testid={`text-notification-message-${notification.id}`}>
                        {notification.message}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(notification.id);
                      }}
                      data-testid={`button-delete-notification-${notification.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400" data-testid="text-no-notifications">
                  {filterType !== 'all' || filterRead !== 'all'
                    ? 'No matching notifications'
                    : 'No notifications'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-72 xl:w-80 shrink-0">
          <div className="lg:sticky lg:top-8 bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-900" data-testid="text-preferences-title">
                Preferences
              </h2>
            </div>

            {loadingPreferences ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-2 animate-pulse flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 flex-1" />
                    <div className="w-8 h-4 bg-gray-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2" data-testid="text-categories-heading">
                    Categories
                  </h3>
                  <div className="divide-y divide-gray-200/50">
                    {categorySettings.map((setting) => {
                      const Icon = setting.icon;
                      const isEnabled = preferences?.[setting.key] ?? true;
                      return (
                        <div
                          key={setting.key}
                          className="py-2.5 flex items-center gap-2.5"
                          data-testid={`card-preference-${setting.key}`}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-200/70">
                            <Icon className="h-3 w-3 text-gray-500" />
                          </div>
                          <span className="text-sm text-gray-700 flex-1" data-testid={`text-preference-label-${setting.key}`}>
                            {setting.label}
                          </span>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleToggle(setting.key, checked)}
                            disabled={updatePrefMutation.isPending}
                            className="scale-90"
                            data-testid={`switch-${setting.key}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2" data-testid="text-delivery-heading">
                    Delivery
                  </h3>
                  <div className="divide-y divide-gray-200/50">
                    {deliverySettings.map((setting) => {
                      const Icon = setting.icon;
                      const isEnabled = preferences?.[setting.key] ?? true;
                      return (
                        <div
                          key={setting.key}
                          className="py-2.5 flex items-center gap-2.5"
                          data-testid={`card-delivery-${setting.key}`}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-200/70">
                            <Icon className="h-3 w-3 text-gray-500" />
                          </div>
                          <span className="text-sm text-gray-700 flex-1" data-testid={`text-delivery-label-${setting.key}`}>
                            {setting.label}
                          </span>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleToggle(setting.key, checked)}
                            disabled={updatePrefMutation.isPending}
                            className="scale-90"
                            data-testid={`switch-${setting.key}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
