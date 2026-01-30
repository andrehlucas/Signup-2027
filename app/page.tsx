'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Location, UserType } from '../shared/schema';
import { MapPin, Phone, User, MoreVertical, CreditCard, FileEdit, Users, Mail, Calendar, Settings, ChevronRight } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { LocationMedia } from './portal-components/LocationMedia';
import { QuickActionCard } from './portal-components/QuickActionCard';
import { FeatureItem } from './portal-components/FeatureItem';
import { NotificationToast } from './portal-components/NotificationToast';

const initialNotifications = [
  { id: '1', type: 'info' as const, title: 'New Mail Received', message: 'You have 3 new pieces of mail waiting at your office location.' },
  { id: '2', type: 'success' as const, title: 'Payment Processed', message: 'Your monthly subscription has been renewed successfully.' },
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
  { icon: CreditCard, title: 'Update Payment Method', description: 'Manage your credit cards and billing information' },
  { icon: Calendar, title: 'Book a Meeting Room', description: 'Reserve professional office space or conference rooms' },
  { icon: Mail, title: 'Mail Preferences', description: 'Set up mail forwarding or scanning instructions' },
  { icon: Phone, title: 'Call Forwarding', description: 'Configure how your business calls are routed' },
  { icon: Users, title: 'Refer a Client', description: 'Earn rewards by referring new businesses to Opus VO' },
  { icon: Settings, title: 'Account Settings', description: 'Update your company profile and login details' },
];

export default function PortalDashboard() {
  const { data: user } = useQuery<UserType>({
    queryKey: ['/api/user']
  });

  const { data: locations, isLoading } = useQuery<Location[]>({ 
    queryKey: ['/api/locations'] 
  });
  
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(initialNotifications);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const displayLocations = (locations && locations.length > 0) ? locations : [
    { id: '1', name: 'Manhattan Office', address: '848 Brickell Avenue, Penthouse 5', imageUrl: '/office-building_1761587957783.webp' },
    { id: '2', name: 'Brooklyn Hub', address: '456 Atlantic Ave, Brooklyn, NY', imageUrl: '/new-york-aerial-view_1761593422460.webp' },
    { id: '3', name: 'Los Angeles Office', address: '789 Wilshire Blvd, LA, CA', imageUrl: '/los-angeles.webp' },
  ];

  if (!activeLocation && displayLocations.length > 0) {
    setActiveLocation(displayLocations[0].id);
  }

  const currentLocation = displayLocations.find(loc => loc.id === activeLocation) || displayLocations[0];

  const businessName = user?.businessName || 'Acme Corporation';

  return (
    <div className="p-4 lg:p-8" data-testid="portal-dashboard">
      <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-welcome">
        Welcome, {businessName}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <LocationMedia
            buildingImage={currentLocation.imageUrl || '/office-building_1761587957783.webp'}
            mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.6595159366707!2d-80.19180492441!3d25.76168277735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b69c20e3f7c9%3A0x9e9b2d99b7c12d83!2s848%20Brickell%20Ave%2C%20Miami%2C%20FL%2033131!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            address={currentLocation.address}
            city="Miami FL 33131"
          />

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Phone Number:</span>
              <span className="text-gray-600" data-testid="text-phone">(305) 555 - 1234</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-gray-900">Extension(s):</span>
              <div className="flex items-center gap-2 ml-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Michael Torres</span>
                <Badge variant="outline" className="bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9] rounded-full px-2.5 py-0.5 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] mr-1.5 inline-block" />
                  Marketing
                </Badge>
              </div>
              <span className="text-gray-300 mx-2">|</span>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Sarah Chen</span>
                <Badge variant="outline" className="bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9] rounded-full px-2.5 py-0.5 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] mr-1.5 inline-block" />
                  Sales
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Your Office Package Includes:</h3>
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

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900" data-testid="heading-quick-actions">Quick Actions</h2>
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

      <NotificationToast 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
    </div>
  );
}
