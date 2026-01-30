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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative rounded-xl overflow-hidden h-[280px]">
        <img
          src={buildingImage}
          alt="Office Building"
          className="w-full h-full object-cover"
          data-testid="img-building"
        />
        <div 
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          }}
        >
          <div 
            className="backdrop-blur-md rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate" data-testid="text-address">
                {address}
              </p>
              <p className="text-white/70 text-xs">{city}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                className="text-white border-white/40 bg-white/10 hover:bg-white/20 hover:border-white/60 text-xs px-3"
                onClick={onGetDirections}
                data-testid="button-get-directions"
              >
                <Navigation className="h-3.5 w-3.5 mr-1.5" />
                Get Directions
              </Button>
              <Button 
                size="sm"
                className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white text-xs px-3"
                onClick={onShare}
                data-testid="button-share"
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden h-[280px] bg-gray-100">
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
  );
}
