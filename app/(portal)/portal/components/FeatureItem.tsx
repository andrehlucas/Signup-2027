'use client';

import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  icon: LucideIcon;
  label: string;
  iconColor?: string;
}

export function FeatureItem({
  icon: Icon,
  label,
  iconColor = 'text-[#36bff9]',
}: FeatureItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`h-4 w-4 ${iconColor}`} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
