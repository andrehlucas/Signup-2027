'use client';

import { X, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
}

interface AlertComponentProps {
  alert: Alert | null;
  onDismiss: () => void;
}

export function AlertComponent({ alert, onDismiss }: AlertComponentProps) {
  if (!alert) return null;

  const getIcon = (type: Alert['type']) => {
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
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:w-[400px] z-50">
      <div
        className="rounded-xl px-4 py-4 flex items-start gap-3 shadow-xl"
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        }}
        data-testid={`alert-${alert.id}`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(alert.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 -mt-1"
          data-testid="button-dismiss-alert"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
