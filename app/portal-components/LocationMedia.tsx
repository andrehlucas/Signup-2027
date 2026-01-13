'use client';

import { Navigation, Share2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LocationMediaProps {
  buildingImage: string;
  mapEmbedUrl: string;
  address: string;
  city: string;
  onGetDirections?: () => void;
  onShare?: () => void;
}

export function LocationMedia({
  buildingImage,
  mapEmbedUrl,
  address,
  city,
  onGetDirections,
  onShare,
}: LocationMediaProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative rounded-xl overflow-hidden h-48 group md:col-span-2">
          <img
            src={buildingImage}
            alt="Office Building"
            className="w-full h-full object-cover"
            data-testid="img-building"
          />
          {/* Mobile Overlay Address */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 md:hidden">
            <p className="text-white font-semibold text-sm leading-tight" data-testid="text-address-mobile">
              {address}
            </p>
            <p className="text-gray-300 text-xs">{city}</p>
          </div>
        </div>
        <div className="hidden md:block rounded-xl overflow-hidden h-48 bg-gray-200">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
            data-testid="map-iframe"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="hidden md:block">
          <p className="text-lg font-semibold text-gray-900" data-testid="text-address">
            {address}
          </p>
          <p className="text-gray-600">{city}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none text-[#36bff9] border-[#36bff9] hover:bg-[#36bff9]/10"
            onClick={onGetDirections}
            data-testid="button-get-directions"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
          <Button 
            className="flex-1 md:flex-none bg-[#36bff9] hover:bg-[#2aa8e0] text-white"
            onClick={onShare}
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
