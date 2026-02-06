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
  Filter,
  Bell,
  Trash2,
  Circle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useToast } from '@/app/hooks/use-toast';
import { Notification, NotificationType } from '../../../shared/schema';

const typeConfig: Record<string, { icon: typeof Mail; label: string; color: string; bgColor: string }> = {
  mail: { icon: Mail, label: 'Mail', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  billing: { icon: CreditCard, label: 'Billing', color: 'text-green-600', bgColor: 'bg-green-50' },
  account: { icon: User, label: 'Account', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  service: { icon: Phone, label: 'Service', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  location: { icon: MapPin, label: 'Location', color: 'text-pink-600', bgColor: 'bg-pink-50' },
};

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

export default function NotificationsMessagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  const queryKey = filterType === 'all' ? ['/api/notifications'] : [`/api/notifications?type=${filterType}`];
  const { data: notifications, isLoading } = useQuery<Notification[]>({
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const filteredNotifications = notifications?.filter(n => {
    if (filterRead === 'unread') return !n.isRead;
    if (filterRead === 'read') return n.isRead;
    return true;
  });

  const unreadCount = unreadData?.count ?? 0;

  return (
    <div className="p-4 lg:p-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-notifications-title">
            Messages
          </h1>
          <p className="text-sm text-gray-500 mt-1" data-testid="text-notifications-subtitle">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllReadMutation.mutate()}
          disabled={unreadCount === 0 || markAllReadMutation.isPending}
          data-testid="button-mark-all-read"
        >
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark all read
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px]" data-testid="select-filter-type">
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
        </div>

        <Select value={filterRead} onValueChange={setFilterRead}>
          <SelectTrigger className="w-[160px]" data-testid="select-filter-read">
            <SelectValue placeholder="All messages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.mail;
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border transition-all cursor-pointer group hover:shadow-md ${
                  notification.isRead
                    ? 'border-gray-200'
                    : 'border-blue-200 bg-blue-50/30'
                }`}
                onClick={() => handleNotificationClick(notification)}
                data-testid={`card-notification-${notification.id}`}
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {!notification.isRead && (
                          <Circle className="h-2 w-2 fill-blue-500 text-blue-500 shrink-0" data-testid={`icon-unread-${notification.id}`} />
                        )}
                        <h3
                          className={`text-sm truncate ${notification.isRead ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}
                          data-testid={`text-notification-title-${notification.id}`}
                        >
                          {notification.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge variant="secondary" className={`text-xs ${config.bgColor} ${config.color} border-0`}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2" data-testid={`text-notification-message-${notification.id}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400" data-testid={`text-notification-time-${notification.id}`}>
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(notification.id);
                          }}
                          data-testid={`button-delete-notification-${notification.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        {notification.link && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500" data-testid="text-no-notifications">
              No notifications
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {filterType !== 'all' || filterRead !== 'all'
                ? 'Try adjusting your filters'
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
