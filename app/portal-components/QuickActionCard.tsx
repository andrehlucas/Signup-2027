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
      className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={onClick}
      data-testid={testId}
    >
      <CardContent className="p-5 flex items-start gap-4">
        <div className="shrink-0 p-2.5 bg-gray-50 rounded-lg">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <div className="space-y-1 overflow-hidden">
          <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
