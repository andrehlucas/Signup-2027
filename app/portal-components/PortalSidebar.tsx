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
  Menu,
  Home,
  Download,
  Phone,
  Gift,
  Users,
  MessageSquare,
  BookOpen,
  Info,
  CreditCard,
  FileText
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
    label: 'Home',
    href: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Download App',
    href: '/download',
    icon: <Download className="h-5 w-5" />,
  },
  {
    label: 'My Account',
    icon: <User className="h-5 w-5" />,
    children: [
      { label: 'Update Login Details', href: '/account/login-details' },
      { label: 'Update Company Name', href: '/account/company-name' },
      { label: 'Manage Services', href: '/account/services' },
      { label: 'Verification Letter', href: '/account/verification-letter' },
      { label: 'Upload Documents', href: '/account/documents' },
      { label: 'Setup/Edit Mail Forwarding', href: '/account/mail-forwarding' },
      { label: 'Setup/Edit Mail Scanning', href: '/account/mail-scanning' },
      { label: 'Update Payment Method', href: '/billing' },
      { label: 'Billing', href: '/billing' },
      { label: 'Cancel Services', href: '/account/cancel' },
    ],
  },
  {
    label: 'My Opus VO Locations',
    icon: <Building2 className="h-5 w-5" />,
    children: [
      { label: 'My Current Opus Mailing Address(es)', href: '/' },
      { label: 'Add Locations', href: '/locations/add' },
      { label: 'Location Change Request', href: '/locations/change' },
    ],
  },
  {
    label: 'My Phone System',
    icon: <Phone className="h-5 w-5" />,
    children: [
      { label: 'After Hours/Company Extension', href: '/phone/after-hours' },
      { label: 'Business Hours/Individual Extension', href: '/phone/business-hours' },
      { label: 'Fax to Email', href: '/phone/fax-to-email' },
      { label: 'Call Out', href: '/phone/call-out' },
      { label: 'Texting', href: '/phone/texting' },
      { label: 'Conference Bridge', href: '/phone/conference' },
      { label: 'Faxout', href: '/phone/faxout' },
      { label: 'Incoming Call Logs', href: '/phone/logs' },
      { label: 'Bypass Live Answer', href: '/phone/bypass' },
    ],
  },
  {
    label: 'Customer Support',
    icon: <HelpCircle className="h-5 w-5" />,
    children: [
      { label: 'Contact Support', href: '/support' },
      { label: 'Submit Ticket', href: '/support/ticket' },
    ],
  },
  {
    label: 'Meeting Rooms/Office Time',
    href: '/meeting-rooms',
    icon: <DoorOpen className="h-5 w-5" />,
  },
  {
    label: 'Support Videos',
    href: '/videos',
    icon: <PlayCircle className="h-5 w-5" />,
  },
  {
    label: 'My Benefits',
    href: '/benefits',
    icon: <Gift className="h-5 w-5" />,
  },
  {
    label: 'Refer a Client',
    href: '/referral',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'FAQ',
    href: '/faq',
    icon: <Info className="h-5 w-5" />,
  },
  {
    label: 'Credit Reporting',
    href: '/credit-reporting',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: 'Messages',
    href: '/messages',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: 'How To',
    href: '/how-to',
    icon: <BookOpen className="h-5 w-5" />,
  },
];

function SidebarContent({ 
  onNavigate 
}: { 
  onNavigate?: () => void 
}) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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
    <div className="flex flex-col h-screen sticky top-0 bg-[#1a1f2e] text-white overflow-hidden">
      <div className="p-4 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-2" data-testid="link-sidebar-logo" onClick={handleNavClick}>
          <img src="/opus-logo-icon.svg" alt="Opus" className="h-8 w-8" />
          <span className="text-xl font-bold text-white">opus</span>
        </Link>
      </div>

      <div className="p-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-[#252b3d] border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
            data-testid="input-portal-search"
          />
        </div>
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
