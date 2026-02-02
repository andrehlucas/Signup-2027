'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  User, 
  PlayCircle, 
  HelpCircle,
  LogOut,
  Menu,
  Home,
  Phone,
  Gift,
  Users,
  MessageSquare,
  BookOpen,
  Bell,
  CreditCard,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/app/components/ui/sheet';
import { NavSection } from './NavSection';
import { PortalSearch } from './PortalSearch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'My Office',
    href: '/office',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    label: 'Phone System',
    href: '/phone',
    icon: <Phone className="h-5 w-5" />,
  },
  {
    label: 'Notifications',
    icon: <Bell className="h-5 w-5" />,
    children: [
      { label: 'Messages', href: '/notifications/messages' },
      { label: 'Alerts & Preferences', href: '/notifications/alerts' },
    ],
  },
  {
    label: 'Account & Billing',
    icon: <CreditCard className="h-5 w-5" />,
    children: [
      { label: 'Login Details', href: '/account/login' },
      { label: 'Company Name', href: '/account/company' },
      { label: 'Payment Methods', href: '/account/payment' },
      { label: 'Billing History', href: '/account/billing' },
      { label: 'Credit Reporting', href: '/account/credit-reporting' },
      { label: 'Cancel Services', href: '/account/cancel' },
    ],
  },
  {
    label: 'Help & Support',
    icon: <HelpCircle className="h-5 w-5" />,
    children: [
      { label: 'Contact Support', href: '/support/contact' },
      { label: 'Support Videos', href: '/support/videos' },
      { label: 'FAQ', href: '/support/faq' },
      { label: 'How To Guides', href: '/support/guides' },
    ],
  },
  {
    label: 'Rewards',
    icon: <Gift className="h-5 w-5" />,
    children: [
      { label: 'My Benefits', href: '/rewards/benefits' },
      { label: 'Refer a Client', href: '/rewards/referral' },
    ],
  },
];

import { useQuery } from '@tanstack/react-query';
import { Location } from "../../shared/schema";

const mockLocations: Location[] = [
  { id: '1', name: 'Manhattan Office', address: '123 5th Avenue, New York, NY', imageUrl: '/attached_assets/manhattan.jpg' },
  { id: '2', name: 'Brooklyn Hub', address: '456 Atlantic Ave, Brooklyn, NY', imageUrl: '/attached_assets/brooklyn.jpg' },
  { id: '3', name: 'Los Angeles Office', address: '789 Wilshire Blvd, LA, CA', imageUrl: '/attached_assets/la.jpg' },
];

function LocationSwitcher() {
  const { data: locations, isLoading } = useQuery<Location[]>({ 
    queryKey: ['/api/locations'] 
  });
  
  const displayLocations = (locations && locations.length > 0) ? locations : mockLocations;
  const [selectedLocation, setSelectedLocation] = useState(displayLocations[0]?.id);

  return (
    <Select value={selectedLocation || displayLocations[0]?.id} onValueChange={setSelectedLocation}>
      <SelectTrigger 
        className="w-full bg-[#252b3d] border-0 text-white focus:ring-1 focus:ring-blue-500"
        data-testid="select-location-switcher"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <MapPin className="h-4 w-4 text-[#36bff9] shrink-0" />
          <SelectValue placeholder="Select location" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#252b3d] border-white/10">
        {displayLocations.map((location) => (
          <SelectItem 
            key={location.id} 
            value={location.id}
            className="text-white focus:bg-white/10 focus:text-white"
            data-testid={`option-location-${location.id}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{location.name}</span>
              <span className="text-xs text-gray-400 truncate">{location.address}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SidebarContent({ 
  onNavigate 
}: { 
  onNavigate?: () => void 
}) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex flex-col h-screen sticky top-0 bg-[#1a1f2e] text-white overflow-hidden">
      <div className="p-4 border-b border-white/10 shrink-0">
        <Link href="/" className="block" data-testid="link-sidebar-logo" onClick={handleNavClick}>
          <img src="/opus-vo-main-logo-white.svg" alt="Opus VO" className="w-3/4 h-auto" />
        </Link>
      </div>

      <div className="p-4 space-y-3 shrink-0">
        <LocationSwitcher />
        <PortalSearch onNavigate={handleNavClick} />
      </div>

      <nav className="flex-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {navItems.map((item) => (
          <NavSection
            key={item.label}
            label={item.label}
            icon={item.icon}
            href={item.href}
            children={item.children}
            isExpanded={expandedItems.includes(item.label)}
            onToggle={() => toggleExpanded(item.label)}
            isActive={isActive}
            onNavigate={handleNavClick}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 flex items-center justify-between shrink-0">
        <span className="text-sm text-gray-300" data-testid="text-username">{'{User-name}'}</span>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors" data-testid="button-logout">
          Logout <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function PortalSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex w-72 min-h-screen flex-col" data-testid="portal-sidebar">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between" data-testid="mobile-header">
        <Link href="/" className="flex items-center" data-testid="link-mobile-logo">
          <img src="/opus-vo-main-logo-white.svg" alt="Opus VO" className="h-8 brightness-0" />
        </Link>
        
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button 
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              data-testid="button-mobile-menu"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-[#1a1f2e]" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="p-0 w-[calc(100%-48px)] bg-[#1a1f2e] border-l-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
