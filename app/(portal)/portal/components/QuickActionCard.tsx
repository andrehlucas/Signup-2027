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
      className="border border-gray-200 hover:border-[#36bff9] hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
      data-testid={testId}
    >
      <CardContent className="p-4 flex items-start gap-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
