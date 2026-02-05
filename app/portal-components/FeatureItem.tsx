'use client';

import { LucideIcon, Lock, Check } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

type FeatureStatus = 'included' | 'active' | 'available';

interface FeatureItemProps {
  icon: LucideIcon;
  label: string;
  iconColor?: string;
  status?: FeatureStatus;
  planName?: string;
}

export function FeatureItem({
  icon: Icon,
  label,
  iconColor = 'text-[#36bff9]',
  status,
  planName,
}: FeatureItemProps) {
  const renderStatusBadge = () => {
    if (!status) return null;
    
    switch (status) {
      case 'included':
        return (
          <Badge 
            className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5"
            data-testid={`status-badge-included`}
          >
            <Lock className="h-3 w-3 mr-1" />
            Included{planName ? ` in ${planName}` : ''}
          </Badge>
        );
      case 'active':
        return (
          <Badge 
            className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5"
            data-testid={`status-badge-active`}
          >
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'available':
        return (
          <Badge 
            variant="outline" 
            className="text-gray-500 border-gray-200 text-xs px-2 py-0.5"
            data-testid={`status-badge-available`}
          >
            Available
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      {renderStatusBadge()}
    </div>
  );
}
