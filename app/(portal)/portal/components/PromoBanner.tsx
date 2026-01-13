'use client';

import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl: string;
  imageAlt: string;
  onClose?: () => void;
  onButtonClick?: () => void;
}

export function PromoBanner({
  title,
  subtitle,
  buttonText,
  imageUrl,
  imageAlt,
  onClose,
  onButtonClick,
}: PromoBannerProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-b from-[#2a3042] to-[#1a1f2e] border border-white/10" data-testid="promo-banner">
      <div className="relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-white/60 hover:text-white z-10"
            data-testid="button-close-promo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="p-3">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <div className="relative h-32">
          <img 
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e] to-transparent" />
        </div>
        <div className="p-3 pt-0">
          <Button 
            onClick={onButtonClick}
            className="w-full bg-[#36bff9] hover:bg-[#2aa8e0] text-white text-sm font-medium"
            data-testid="button-promo-action"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
