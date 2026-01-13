'use client';

import { useState } from 'react';
import { MapPin, Phone, User, MoreVertical, CreditCard, FileEdit, Users, Mail, Calendar, Settings } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { LocationMedia } from './portal-components/LocationMedia';
import { QuickActionCard } from './portal-components/QuickActionCard';
import { FeatureItem } from './portal-components/FeatureItem';

const locations = [
  {
    id: 'location-01',
    name: 'Location 01',
    address: '848 Brickell Avenue, Penthouse 5',
    city: 'Miami FL 33131',
    phone: '(xxx) xxx - xxxx',
    extensions: [
      { name: 'John Smith', department: 'Marketing' },
      { name: 'Sam Smith', department: 'Sales' },
    ],
    buildingImage: '/office-building_1761587957783.webp',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.6595159366707!2d-80.19180492441!3d25.76168277735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b69c20e3f7c9%3A0x9e9b2d99b7c12d83!2s848%20Brickell%20Ave%2C%20Miami%2C%20FL%2033131!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
  },
  {
    id: 'location-02',
    name: 'Location 02',
    address: '1234 Corporate Plaza, Suite 100',
    city: 'New York NY 10001',
    phone: '(xxx) xxx - xxxx',
    extensions: [
      { name: 'Jane Doe', department: 'Support' },
    ],
    buildingImage: '/new-york-aerial-view_1761593422460.webp',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.9897!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjIiTiA3M8KwNTknMjIuOSJX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
  },
  {
    id: 'location-03',
    name: 'Location 03',
    address: '5678 Business Center Dr',
    city: 'Los Angeles CA 90001',
    phone: '(xxx) xxx - xxxx',
    extensions: [
      { name: 'Bob Johnson', department: 'Operations' },
    ],
    buildingImage: '/multiple-professionals_1761593320843.webp',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7!2d-118.2437!3d34.0522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
  },
];

const packageFeatures = [
  { icon: MapPin, label: 'Prestigious Business Address' },
  { icon: Phone, label: 'Professional Live Call Answering' },
  { icon: Phone, label: 'Personalized Call Transferring' },
  { icon: Phone, label: 'Voicemail/Fax Converted to Email' },
  { icon: Phone, label: 'Business Phone/Fax Number' },
  { icon: FileEdit, label: 'Professional Mail Receipt' },
];

const quickActions = [
  { icon: CreditCard, title: 'Update Payment Method', description: 'Add yourself or import from CSV' },
  { icon: Users, title: 'Manage Team Members', description: 'Add or remove team access and roles' },
  { icon: Mail, title: 'Mail Preferences', description: 'Configure mail forwarding settings' },
  { icon: Calendar, title: 'Book Meeting Room', description: 'Reserve a conference room' },
  { icon: Phone, title: 'Call Forwarding', description: 'Set up call routing preferences' },
  { icon: Settings, title: 'Account Settings', description: 'Manage your account preferences' },
];

export default function PortalDashboard() {
  const [activeLocation, setActiveLocation] = useState('location-01');

  return (
    <div className="p-8" data-testid="portal-dashboard">
      <h1 className="text-3xl font-bold text-gray-900 mb-6" data-testid="heading-welcome">
        Welcome, {'{business-name}'}
      </h1>

      <Tabs value={activeLocation} onValueChange={setActiveLocation} className="mb-8">
        <TabsList className="bg-white border border-gray-200 p-1 h-auto">
          {locations.map((location) => (
            <TabsTrigger
              key={location.id}
              value={location.id}
              className="data-[state=active]:bg-[#1a1f2e] data-[state=active]:text-white px-4 py-2 rounded-md"
              data-testid={`tab-${location.id}`}
            >
              {location.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {locations.map((location) => (
          <TabsContent key={location.id} value={location.id} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LocationMedia
                  buildingImage={location.buildingImage}
                  mapEmbedUrl={location.mapUrl}
                  address={location.address}
                  city={location.city}
                />

                <div className="mb-2">
                  <span className="font-medium text-gray-900">Phone Number:</span>
                  <span className="text-gray-600 ml-2" data-testid="text-phone">{location.phone}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-medium text-gray-900">Extension(s):</span>
                  {location.extensions.map((ext, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{ext.name}</span>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-green-500 text-green-600"
                        data-testid={`badge-extension-${idx}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                        {ext.department}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Card className="border-0 shadow-sm" data-testid="card-package-features">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Your Office Package Includes:</h3>
                    <div className="space-y-3">
                      {packageFeatures.map((feature, idx) => (
                        <FeatureItem
                          key={idx}
                          icon={feature.icon}
                          label={feature.label}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900" data-testid="heading-quick-actions">Quick Actions</h2>
          <button className="text-gray-400 hover:text-gray-600" data-testid="button-more-actions">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
