'use client';

import { useState } from 'react';
import { X, Building2, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ExpandLocationBannerProps {
  onAddLocation?: () => void;
}

export function ExpandLocationBanner({ onAddLocation }: ExpandLocationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div 
      className="relative overflow-hidden rounded-xl mb-6"
      data-testid="expand-location-banner"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2942] via-[#1e3a5f] to-[#0d4f6e]" />
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#36bff9] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#36bff9] rounded-full blur-3xl translate-y-1/2" />
      </div>
      
      <div className="absolute top-4 right-4 hidden lg:flex gap-6 opacity-20">
        <Building2 className="h-24 w-24 text-white" strokeWidth={0.5} />
        <MapPin className="h-16 w-16 text-[#36bff9] mt-4" strokeWidth={0.5} />
      </div>
      
      <div className="relative px-6 py-5 lg:py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start lg:items-center gap-4">
          <div className="hidden sm:flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#36bff9] to-[#2aa8e0] items-center justify-center shrink-0 shadow-lg shadow-[#36bff9]/20">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-[#36bff9]" />
              <span className="text-xs font-medium text-[#36bff9] uppercase tracking-wide">
                Growth Opportunity
              </span>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-white">
              Expand your business presence
            </h3>
            <p className="text-sm text-gray-300 mt-0.5">
              Add a new location and establish your brand in more markets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:shrink-0">
          <Button
            onClick={onAddLocation}
            className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white font-semibold px-6 py-2.5 shadow-lg shadow-[#36bff9]/30 transition-all hover:shadow-[#36bff9]/40 hover:scale-[1.02]"
            data-testid="button-add-location"
          >
            Add New Location
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        data-testid="button-dismiss-banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
