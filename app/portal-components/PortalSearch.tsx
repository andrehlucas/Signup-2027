'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

interface SearchableItem {
  title: string;
  href: string;
  keywords: string[];
  description: string;
  category: string;
}

/**
 * SEARCHABLE PAGES INDEX
 * 
 * To add a new page to the search index:
 * 1. Add a new object to this array with the following structure:
 *    - title: Display name shown in search results
 *    - href: Route path for navigation
 *    - keywords: Array of single words that users might search for (whole words only)
 *    - description: Brief description shown in search results preview
 *    - category: Group label for the result (e.g., 'Office', 'Phone System')
 * 
 * Example:
 * {
 *   title: 'New Feature Page',
 *   href: '/new-feature',
 *   keywords: ['feature', 'new', 'example'],
 *   description: 'Description of what this page does',
 *   category: 'Category Name',
 * }
 * 
 * Note: Search matches complete words only. If you add 'form' as a keyword,
 * it will match searches for "form" but not "information".
 */
const searchablePages: SearchableItem[] = [
  {
    title: 'Home',
    href: '/',
    keywords: ['home', 'dashboard', 'overview', 'welcome', 'quick', 'actions'],
    description: 'Your portal dashboard with location overview and quick actions',
    category: 'Main',
  },
  {
    title: 'My Office',
    href: '/office',
    keywords: ['office', 'address', 'mail', 'forwarding', 'scanning', 'documents', 'upload', '1583', 'usps', 'directions', 'share', 'location', 'form'],
    description: 'Manage your virtual office address, mail forwarding, mail scanning, and document uploads',
    category: 'Office',
  },
  {
    title: 'Meeting Rooms',
    href: '/meeting-rooms',
    keywords: ['meeting', 'rooms', 'conference', 'office time', 'book', 'reserve', 'schedule'],
    description: 'Book meeting rooms and reserve office time at your location',
    category: 'Office',
  },
  {
    title: 'Extensions & Voicemail',
    href: '/phone/extensions',
    keywords: ['extensions', 'voicemail', 'phone', 'number', 'message'],
    description: 'Manage phone extensions and voicemail settings',
    category: 'Phone System',
  },
  {
    title: 'Fax Services',
    href: '/phone/fax',
    keywords: ['fax', 'send', 'receive', 'documents'],
    description: 'Send and receive faxes through your business number',
    category: 'Phone System',
  },
  {
    title: 'Texting',
    href: '/phone/texting',
    keywords: ['texting', 'sms', 'text', 'messages'],
    description: 'Send and receive text messages from your business number',
    category: 'Phone System',
  },
  {
    title: 'Conference Calls',
    href: '/phone/conference',
    keywords: ['conference', 'calls', 'meeting', 'multi-party'],
    description: 'Set up and manage conference calls',
    category: 'Phone System',
  },
  {
    title: 'Call Logs & Settings',
    href: '/phone/logs',
    keywords: ['call', 'logs', 'history', 'settings', 'forwarding'],
    description: 'View call history and configure phone settings',
    category: 'Phone System',
  },
  {
    title: 'Notifications',
    href: '/notifications',
    keywords: ['messages', 'inbox', 'notifications', 'communication', 'alerts', 'preferences', 'settings', 'email'],
    description: 'View messages and configure notification preferences',
    category: 'Notifications',
  },
  {
    title: 'Login Details',
    href: '/account/login',
    keywords: ['login', 'password', 'email', 'credentials', 'security'],
    description: 'Update your login credentials and security settings',
    category: 'Account & Billing',
  },
  {
    title: 'Company Name',
    href: '/account/company',
    keywords: ['company', 'name', 'business', 'profile'],
    description: 'Update your company name and business profile',
    category: 'Account & Billing',
  },
  {
    title: 'Payment Methods',
    href: '/account/payment',
    keywords: ['payment', 'credit card', 'billing', 'card', 'pay'],
    description: 'Manage your payment methods and credit cards',
    category: 'Account & Billing',
  },
  {
    title: 'Billing History',
    href: '/account/billing',
    keywords: ['billing', 'history', 'invoices', 'receipts', 'charges'],
    description: 'View your billing history and download invoices',
    category: 'Account & Billing',
  },
  {
    title: 'Credit Reporting',
    href: '/account/credit-reporting',
    keywords: ['credit', 'reporting', 'score', 'business credit'],
    description: 'Manage credit reporting for your business',
    category: 'Account & Billing',
  },
  {
    title: 'Cancel Services',
    href: '/account/cancel',
    keywords: ['cancel', 'services', 'subscription', 'close'],
    description: 'Cancel or modify your service subscriptions',
    category: 'Account & Billing',
  },
  {
    title: 'Contact Support',
    href: '/support/contact',
    keywords: ['support', 'contact', 'help', 'ticket', 'issue'],
    description: 'Contact our support team for assistance',
    category: 'Help & Support',
  },
  {
    title: 'Support Videos',
    href: '/support/videos',
    keywords: ['videos', 'tutorials', 'how to', 'guides', 'learn'],
    description: 'Watch tutorial videos and learn how to use features',
    category: 'Help & Support',
  },
  {
    title: 'FAQ',
    href: '/support/faq',
    keywords: ['faq', 'questions', 'answers', 'help', 'common'],
    description: 'Find answers to frequently asked questions',
    category: 'Help & Support',
  },
  {
    title: 'How To Guides',
    href: '/support/guides',
    keywords: ['guides', 'how to', 'instructions', 'step by step'],
    description: 'Step-by-step guides for using our services',
    category: 'Help & Support',
  },
  {
    title: 'My Benefits',
    href: '/rewards/benefits',
    keywords: ['benefits', 'rewards', 'perks', 'membership'],
    description: 'View your membership benefits and rewards',
    category: 'Rewards',
  },
  {
    title: 'Refer a Client',
    href: '/rewards/referral',
    keywords: ['refer', 'referral', 'invite', 'share', 'earn'],
    description: 'Refer new clients and earn rewards',
    category: 'Rewards',
  },
];

function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '**$1**');
}

export function PortalSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Helper to check if a word matches the query (whole word match)
  const matchesWord = (text: string, queryWord: string): boolean => {
    const words = text.toLowerCase().split(/\s+/);
    return words.some(word => word === queryWord);
  };

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    
    // Match complete words only
    const filtered = searchablePages.filter(page => {
      // Check if title contains the exact word
      const titleMatch = matchesWord(page.title, lowerQuery);
      
      // Check if any keyword matches exactly
      const keywordMatch = page.keywords.some(k => k.toLowerCase() === lowerQuery);
      
      // Check if description contains the exact word
      const descMatch = matchesWord(page.description, lowerQuery);
      
      return titleMatch || keywordMatch || descMatch;
    });

    setResults(filtered);
    setIsOpen(true);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const navigateToResult = (item: SearchableItem) => {
    router.push(item.href);
    setQuery('');
    setIsOpen(false);
    if (onNavigate) {
      onNavigate();
    }
  };

  const renderHighlightedText = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="text-[#36bff9] font-semibold">{part}</span>
        : part
    );
  };

  // Find where the match occurred and return a preview snippet
  const getMatchPreview = (page: SearchableItem): string | null => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Check keywords first
    const matchedKeyword = page.keywords.find(k => k.toLowerCase() === lowerQuery);
    if (matchedKeyword) {
      return `Keyword: "${matchedKeyword}"`;
    }
    
    // Check title
    if (matchesWord(page.title, lowerQuery)) {
      return `Title: "${page.title}"`;
    }
    
    // Check description - show snippet around the matched word
    if (matchesWord(page.description, lowerQuery)) {
      const words = page.description.split(/\s+/);
      const matchIndex = words.findIndex(w => w.toLowerCase().replace(/[.,!?;:]/g, '') === lowerQuery);
      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 3);
        const end = Math.min(words.length, matchIndex + 4);
        const snippet = words.slice(start, end).join(' ');
        return `"...${snippet}..."`;
      }
    }
    
    return null;
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          ref={inputRef}
          placeholder="Search" 
          className="pl-10 bg-[#252b3d] border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
          data-testid="input-portal-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#252b3d] border border-white/10 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
          data-testid="search-results-dropdown"
        >
          {results.map((result, index) => (
            <button
              key={result.href}
              onClick={() => navigateToResult(result)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                index === selectedIndex 
                  ? 'bg-white/10' 
                  : 'hover:bg-white/5'
              } ${index !== results.length - 1 ? 'border-b border-white/5' : ''}`}
              data-testid={`search-result-${index}`}
            >
              <FileText className="h-5 w-5 text-[#36bff9] mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">
                    {renderHighlightedText(result.title)}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0">
                    {result.category}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">
                  {renderHighlightedText(result.description)}
                </p>
                {getMatchPreview(result) && (
                  <p className="text-xs text-[#36bff9]/70 mt-1 italic">
                    Found: {renderHighlightedText(getMatchPreview(result) || '')}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#252b3d] border border-white/10 rounded-lg shadow-xl z-50 p-4"
          data-testid="search-no-results"
        >
          <p className="text-gray-400 text-sm text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
