'use client';

import { useState } from 'react';
import { X, Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
}

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  if (notifications.length === 0) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-[#4caf50]" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-[#ff9800]" />;
      default:
        return <Info className="h-5 w-5 text-[#36bff9]" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:w-[400px] z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="backdrop-blur-md rounded-xl px-4 py-3 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300"
          style={{
            background: 'rgba(26, 31, 46, 0.95)',
            border: '1px solid rgba(54, 191, 249, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
          data-testid={`toast-notification-${notification.id}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{notification.title}</p>
            <p className="text-xs text-white/70 mt-0.5">{notification.message}</p>
          </div>
          <button
            onClick={() => onDismiss(notification.id)}
            className="flex-shrink-0 text-white/50 hover:text-white transition-colors"
            data-testid={`button-dismiss-${notification.id}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
