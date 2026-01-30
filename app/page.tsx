'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Location } from '../shared/schema';
import { MapPin, Phone, User, MoreVertical, CreditCard, FileEdit, Users, Mail, Calendar, Settings, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { LocationMedia } from './portal-components/LocationMedia';
import { QuickActionCard } from './portal-components/QuickActionCard';
import { FeatureItem } from './portal-components/FeatureItem';
import { Button } from '@/app/components/ui/button';

const packageFeatures = [
  { icon: MapPin, label: 'Prestigious Business Address' },
  { icon: Phone, label: 'Professional Live Call Answering' },
  { icon: Phone, label: 'Personalized Call Transferring' },
  { icon: Phone, label: 'Voicemail/Fax Converted to Email' },
  { icon: Phone, label: 'Business Phone/Fax Number' },
  { icon: FileEdit, label: 'Professional Mail Receipt' },
];

const quickActions = [
  { icon: User, title: 'Update Payment Method', description: 'Add yourself or import from CSV' },
  { icon: FileEdit, title: 'Create a new post', description: 'Dive into the editor and start creating' },
  { icon: FileEdit, title: 'Create a new post', description: 'Dive into the editor and start creating' },
  { icon: FileEdit, title: 'Create a new post', description: 'Dive into the editor and start creating' },
  { icon: FileEdit, title: 'Create a new post', description: 'Dive into the editor and start creating' },
  { icon: FileEdit, title: 'Create a new post', description: 'Dive into the editor and start creating' },
];

export default function PortalDashboard() {
  const { data: locations, isLoading, error } = useQuery<Location[]>({ 
    queryKey: ['/api/locations'] 
  });
  
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  // Use dummy locations if API fails or is loading to ensure preview
  const displayLocations = (locations && locations.length > 0) ? locations : [
    { id: '1', name: 'Manhattan Office', address: '123 5th Avenue, New York, NY', imageUrl: '/attached_assets/manhattan.jpg' },
    { id: '2', name: 'Brooklyn Hub', address: '456 Atlantic Ave, Brooklyn, NY', imageUrl: '/attached_assets/brooklyn.jpg' },
    { id: '3', name: 'Los Angeles Office', address: '789 Wilshire Blvd, LA, CA', imageUrl: '/attached_assets/la.jpg' },
  ];

  // Set default active location once data is loaded or if using dummies
  if (!activeLocation && displayLocations.length > 0) {
    setActiveLocation(displayLocations[0].id);
  }

  const currentLocation = displayLocations.find(loc => loc.id === activeLocation) || displayLocations[0];

  return (
    <div className="p-4 md:p-8" data-testid="portal-dashboard">
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-6" data-testid="heading-welcome">
        Welcome, {'{business-name}'}
      </h1>

      <Tabs value={activeLocation || displayLocations[0].id} onValueChange={setActiveLocation} className="mb-8">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <TabsContent value={currentLocation.id} className="mt-0">
              <div className="space-y-6">
                <LocationMedia
                  buildingImage={currentLocation.imageUrl || '/office-building_1761587957783.webp'}
                  mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.6595159366707!2d-80.19180492441!3d25.76168277735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b69c20e3f7c9%3A0x9e9b2d99b7c12d83!2s848%20Brickell%20Ave%2C%20Miami%2C%20FL%2033131!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  address={currentLocation.address}
                  city=""
                />

                <div className="space-y-2">
                  <div className="text-lg font-medium text-gray-900">{currentLocation.address}</div>
                  <div className="text-gray-600">Miami FL 33131</div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button className="bg-[#36bff9] hover:bg-[#2da9e0] text-white">
                      Get Directions <MapPin className="h-4 w-4 ml-2" />
                    </Button>
                    <Button className="bg-[#36bff9] hover:bg-[#2da9e0] text-white">
                      Share <ChevronRight className="rotate-[-90deg] h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  <div className="pt-4">
                    <span className="font-medium text-gray-900">Phone Number:</span>
                    <span className="text-gray-600 ml-2" data-testid="text-phone">(xxx) xxx - xxxx</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <span className="font-medium text-gray-900">Extension(s):</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">John Smith</span>
                      <Badge variant="outline" className="bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9] rounded-full px-3">Marketing</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">Sam Smith</span>
                      <Badge variant="outline" className="bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9] rounded-full px-3">Sales</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="w-80 shrink-0">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Your Office Package Includes:</h3>
              <div className="space-y-3">
                {packageFeatures.map((feature, idx) => (
                  <FeatureItem
                    key={idx}
                    icon={feature.icon}
                    label={feature.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Tabs>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900" data-testid="heading-quick-actions">Quick Actions</h2>
          <button className="text-gray-400 hover:text-gray-600" data-testid="button-more-actions">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => (
            <QuickActionCard
              key={idx}
              icon={action.icon}
              title={action.title}
              description={action.description}
              testId={`card-quick-action-${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

