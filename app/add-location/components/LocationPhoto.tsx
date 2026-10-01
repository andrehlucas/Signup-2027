'use client';

import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { AvailableLocation } from '../types';

export function LocationPhoto({ location }: { location: AvailableLocation }) {
  const [unavailable, setUnavailable] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ aspectRatio: '1.85 / 1' }}
    >
      {unavailable ? (
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-sm text-gray-600">
          <ImageOff className="h-8 w-8 text-gray-400" aria-hidden="true" />
          <span>Location photo unavailable</span>
        </div>
      ) : (
        <img
          src={location.imageUrl}
          alt={`${location.name} — ${location.address}, ${location.city}, ${location.stateCode}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setUnavailable(true)}
          data-testid={`location-photo-${location.id}`}
        />
      )}
    </div>
  );
}