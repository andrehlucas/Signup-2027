'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface NavChild {
  label: string;
  href: string;
}

interface NavSectionProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavChild[];
  isExpanded?: boolean;
  onToggle?: () => void;
  isActive?: (href: string) => boolean;
  testIdPrefix?: string;
}

export function NavSection({
  label,
  icon,
  href,
  children,
  isExpanded = false,
  onToggle,
  isActive = () => false,
  testIdPrefix = 'nav',
}: NavSectionProps) {
  const slugLabel = label.toLowerCase().replace(/\s+/g, '-');

  if (children && children.length > 0) {
    return (
      <div className="mb-1">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
          data-testid={`button-${testIdPrefix}-${slugLabel}`}
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium">{label}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive(child.href)
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                data-testid={`link-${testIdPrefix}-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-1">
      <Link
        href={href!}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
          isActive(href!)
            ? "bg-white/10 text-white font-medium"
            : "text-gray-300 hover:bg-white/5"
        )}
        data-testid={`link-${testIdPrefix}-${slugLabel}`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Link>
    </div>
  );
}
