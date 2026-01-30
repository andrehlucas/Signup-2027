'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  testId?: string;
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  testId,
}: QuickActionCardProps) {
  return (
    <Card 
      className="border border-gray-100 shadow-sm hover:shadow-md hover:border-[#36bff9]/30 transition-all cursor-pointer bg-white h-full"
      onClick={onClick}
      data-testid={testId}
    >
      <CardContent className="p-4 flex items-center gap-4 h-full min-h-[88px]">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{title}</h4>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
