'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Building2, 
  User, 
  PlayCircle, 
  DoorOpen, 
  HelpCircle,
  LogOut,
  Menu
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/app/components/ui/sheet';
import { NavSection } from './NavSection';
import { PromoBanner } from './PromoBanner';

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
      { label: 'Locations', href: '/' },
      { label: 'Addons', href: '/addons' },
    ],
  },
  {
    label: 'Account',
    icon: <User className="h-5 w-5" />,
    children: [
      { label: 'Account Details', href: '/account' },
      { label: 'Billing', href: '/billing' },
    ],
  },
  {
    label: 'How to / Videos',
    href: '/videos',
    icon: <PlayCircle className="h-5 w-5" />,
  },
  {
    label: 'Meeting Rooms',
    href: '/meeting-rooms',
    icon: <DoorOpen className="h-5 w-5" />,
  },
  {
    label: 'Support',
    href: '/support',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

function SidebarContent({ 
  onNavigate 
}: { 
  onNavigate?: () => void 
}) {
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

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1f2e] text-white">
      <div className="p-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2" data-testid="link-sidebar-logo" onClick={handleNavClick}>
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

      {showPromo && (
        <div className="mx-3 mb-4">
          <PromoBanner
            title="5 Free hours of"
            subtitle="Conference Room available!"
            buttonText="Book your conference room now!"
            imageUrl="/receptionist-card-bg_1761593285326.webp"
            imageAlt="Conference Room"
            onClose={() => setShowPromo(false)}
          />
        </div>
      )}

      <div className="p-4 border-t border-white/10 flex items-center justify-between">
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
      <aside className="hidden lg:flex w-64 min-h-screen flex-col" data-testid="portal-sidebar">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between" data-testid="mobile-header">
        <Link href="/" className="flex items-center gap-2" data-testid="link-mobile-logo">
          <img src="/opus-logo-icon.svg" alt="Opus" className="h-8 w-8" />
          <span className="text-xl font-bold text-[#1a1f2e]">opus</span>
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
          <SheetContent side="right" className="p-0 w-[calc(100%-24px)] bg-[#1a1f2e] border-l-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
