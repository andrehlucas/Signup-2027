'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Building2, 
  MapPin, 
  Package, 
  User, 
  FileText, 
  CreditCard, 
  PlayCircle, 
  DoorOpen, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'My Office',
    icon: <Building2 className="h-5 w-5" />,
    children: [
      { label: 'Locations', href: '/portal' },
      { label: 'Addons', href: '/portal/addons' },
    ],
  },
  {
    label: 'Account',
    icon: <User className="h-5 w-5" />,
    children: [
      { label: 'Account Details', href: '/portal/account' },
      { label: 'Billing', href: '/portal/billing' },
    ],
  },
  {
    label: 'How to / Videos',
    href: '/portal/videos',
    icon: <PlayCircle className="h-5 w-5" />,
  },
  {
    label: 'Meeting Rooms',
    href: '/portal/meeting-rooms',
    icon: <DoorOpen className="h-5 w-5" />,
  },
  {
    label: 'Support',
    href: '/portal/support',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['My Office', 'Account']);
  const [showPromo, setShowPromo] = useState(true);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 min-h-screen bg-[#1a1f2e] text-white flex flex-col" data-testid="portal-sidebar">
      <div className="p-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2" data-testid="link-portal-logo">
          <img src="/opus-logo-icon.svg" alt="Opus" className="h-8 w-8" />
          <span className="text-xl font-bold text-white">opus</span>
        </Link>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-[#252b3d] border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
            data-testid="input-portal-search"
          />
        </div>
      </div>

      <nav className="flex-1 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.label} className="mb-1">
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                  data-testid={`button-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {expandedItems.includes(item.label) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedItems.includes(item.label) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-white/10 text-white font-medium"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                        data-testid={`link-nav-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive(item.href!)
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-300 hover:bg-white/5"
                )}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {showPromo && (
        <div className="mx-3 mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-[#2a3042] to-[#1a1f2e] border border-white/10" data-testid="promo-banner">
          <div className="relative">
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute top-2 right-2 text-white/60 hover:text-white z-10"
              data-testid="button-close-promo"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-3">
              <p className="text-sm font-semibold text-white">5 Free hours of</p>
              <p className="text-xs text-gray-400">Conference Room available!</p>
            </div>
            <div className="relative h-32">
              <img 
                src="/receptionist-card-bg_1761593285326.webp" 
                alt="Conference Room" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e] to-transparent" />
            </div>
            <div className="p-3 pt-0">
              <Button 
                className="w-full bg-[#36bff9] hover:bg-[#2aa8e0] text-white text-sm font-medium"
                data-testid="button-book-conference"
              >
                Book your conference room now!
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-sm text-gray-300" data-testid="text-username">{'{User-name}'}</span>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors" data-testid="button-logout">
          Logout <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
