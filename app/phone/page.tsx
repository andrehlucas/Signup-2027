'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Phone, 
  User, 
  Edit,
  Voicemail,
  FileText,
  Copy,
  HelpCircle,
  Plus,
  X,
  Play,
  Pause,
  Mic,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Check,
  Package
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Switch } from '@/app/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useToast } from '@/app/hooks/use-toast';
import { 
  availableAddons, 
  Addon as MarketplaceAddon, 
  AddonStatus,
  addonToFeatureMap,
  calculatePriceAfterRemoval,
  featureIndividualPrices,
  ESSENTIALS_PLAN,
  Bundle
} from '@/app/add-location/types';
import { useAddons } from '@/app/contexts/AddonsContext';
import { useSubscription } from '@/app/contexts/SubscriptionContext';
import { Trash2, Lock, AlertTriangle } from 'lucide-react';

// Types
interface Extension {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  departmentColor: string;
  businessHoursForwarding: string[];
  afterHoursForwarding: string[];
  voicemailEmail: string;
  voicemailGreetingUrl?: string;
}

interface ActiveAddon {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  hasInstructions: boolean;
  hasEdit: boolean;
}

interface ExploreAddon {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// Mock Data
const companyName = 'Opus Virtual Offices';
const businessPhoneNumber = '(305) 555 - 1234';
const businessFaxNumber = '(305) 555 - 5678';
const faxToEmail = 'fax@opusvo.com';
const mailCallNumber = '(305) 555 - 9999';

const mockExtensions: Extension[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    department: 'Marketing',
    departmentColor: 'green',
    businessHoursForwarding: ['(561) 000 - 0000'],
    afterHoursForwarding: [],
    voicemailEmail: 'john.smith@example.com',
    voicemailGreetingUrl: '/sample-greeting.mp3',
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Smith',
    department: 'Sales',
    departmentColor: 'green',
    businessHoursForwarding: ['(561) 000 - 0000', '(561) 111 - 1111'],
    afterHoursForwarding: ['(561) 222 - 2222'],
    voicemailEmail: 'john.sales@example.com',
    voicemailGreetingUrl: '/sample-greeting.mp3',
  },
];

import { 
  ActiveAddonsList, 
  Addon as ReusableAddon,
  sampleAddons 
} from '../portal-components/addons';

const mockActiveAddons: ActiveAddon[] = [
  {
    id: '1',
    name: 'Callout',
    status: 'active',
    hasInstructions: true,
    hasEdit: false,
  },
];

const mockExploreAddons: ExploreAddon[] = [
  {
    id: '1',
    name: 'Callout',
    description: 'Branded Call Display',
    imageUrl: '/addon-callout.jpg',
  },
  {
    id: '2',
    name: 'Callout',
    description: 'Branded Call Display',
    imageUrl: '/addon-callout.jpg',
  },
];

// Tab type
type TabType = 'phone-system' | 'add-ons';

// Sub-components
const BYPASS_DURATION_SECONDS = 15 * 60; // 15 minutes

function PhoneDetails() {
  const { toast } = useToast();
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [email, setEmail] = useState(faxToEmail);
  const [editingEmail, setEditingEmail] = useState(faxToEmail);
  const [bypassLiveAnswering, setBypassLiveAnswering] = useState(false);
  const [bypassTimeRemaining, setBypassTimeRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasExpiredRef = useRef(false);
  
  // Timer effect for bypass countdown
  useEffect(() => {
    if (bypassLiveAnswering) {
      hasExpiredRef.current = false;
      intervalRef.current = setInterval(() => {
        setBypassTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [bypassLiveAnswering]);
  
  // Handle auto-disable when timer reaches 0 (only after it was previously > 0)
  useEffect(() => {
    if (bypassLiveAnswering && bypassTimeRemaining === 0 && hasExpiredRef.current === false) {
      // Check if we actually had a timer running (not initial state)
      // hasExpiredRef is set to false when bypass is enabled, so if timer reaches 0 
      // and bypass is still on, it means the timer expired
      if (intervalRef.current !== null) {
        hasExpiredRef.current = true;
        setBypassLiveAnswering(false);
        toast({
          title: 'Bypass Live Answering Disabled',
          description: 'The 15-minute bypass period has ended. Live answering is now active again.',
        });
      }
    }
  }, [bypassLiveAnswering, bypassTimeRemaining, toast]);
  
  const handleBypassToggle = (checked: boolean) => {
    setBypassLiveAnswering(checked);
    if (checked) {
      setBypassTimeRemaining(BYPASS_DURATION_SECONDS);
      toast({
        title: 'Bypass Live Answering Enabled',
        description: 'Calls will go directly to you for the next 15 minutes.',
      });
    } else {
      setBypassTimeRemaining(0);
      toast({
        title: 'Bypass Live Answering Disabled',
        description: 'Live answering is now active.',
      });
    }
  };
  
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: text,
    });
  };

  const handleOpenEditEmail = () => {
    setEditingEmail(email);
    setEditEmailOpen(true);
  };

  const handleSaveEmail = () => {
    setEmail(editingEmail);
    setEditEmailOpen(false);
    toast({
      title: 'Email Updated',
      description: 'Fax to email address has been updated.',
    });
  };

  return (
    <>
      <Card className="p-5" data-testid="phone-details-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4" data-testid="heading-phone-details">Phone Details</h2>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Business Phone Number</p>
              <p className="text-sm text-gray-500">{businessPhoneNumber}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <Switch
                  id="bypass-live-answering"
                  checked={bypassLiveAnswering}
                  onCheckedChange={handleBypassToggle}
                  data-testid="switch-bypass-live-answering"
                />
                <Label 
                  htmlFor="bypass-live-answering" 
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                  data-testid="label-bypass-live-answering"
                >
                  Bypass Live Answering
                </Label>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="text-sm text-gray-500 hover:text-gray-700 underline cursor-help"
                      data-testid="button-bypass-tooltip"
                    >
                      What is this?
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="max-w-xs p-3"
                    data-testid="tooltip-bypass-explanation"
                  >
                    <p className="text-sm">
                      <strong>Bypass Live Answering</strong> allows calls to go directly to you without being answered by a live receptionist first.
                    </p>
                    <p className="text-sm mt-2">
                      This is commonly used when you need to receive verification codes via phone call, such as 2-step authentication for banking, services, or account verification.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div>
              <p className="text-sm font-medium text-gray-700">Business Fax Number</p>
              <p className="text-sm text-gray-500">{businessFaxNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Fax to Email</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
              <button
                onClick={() => copyToClipboard(email)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Copy fax email address"
                data-testid="button-copy-fax-email"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button 
                onClick={handleOpenEditEmail}
                className="text-[#E53935] text-sm font-medium hover:underline" 
                data-testid="button-edit-fax-email"
              >
                Edit
              </button>
            </div>
          </div>
        
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-gray-700">For Mail Call:</p>
              <button aria-label="Help about Mail Call" className="cursor-pointer">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-500">{mailCallNumber}</p>
          </div>
        </div>
      </Card>

      <Dialog open={editEmailOpen} onOpenChange={setEditEmailOpen}>
        <DialogContent className="sm:max-w-md" data-testid="edit-email-modal">
          <DialogHeader>
            <DialogTitle>Edit Fax to Email</DialogTitle>
            <DialogDescription>Update the email address where faxes will be sent.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="fax-email">Email Address</Label>
              <Input
                id="fax-email"
                type="email"
                value={editingEmail}
                onChange={(e) => setEditingEmail(e.target.value)}
                placeholder="Enter email address"
                className="mt-1.5"
                data-testid="input-fax-email"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setEditEmailOpen(false)}
              data-testid="button-cancel-email"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEmail}
              className="bg-[var(--blue-light700)] hover:bg-[#015A89] text-white font-medium"
              data-testid="button-save-email"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ExtensionCardProps {
  extension: Extension;
  onEdit: (ext: Extension) => void;
  onVoicemail: (ext: Extension) => void;
  onCallLog: (ext: Extension) => void;
}

function ExtensionCard({ extension, onEdit, onVoicemail, onCallLog }: ExtensionCardProps) {
  const departmentColors: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="border-b border-gray-200 py-5 last:border-b-0" data-testid={`extension-card-${extension.id}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {extension.firstName} {extension.lastName}
              </span>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${departmentColors[extension.departmentColor]}`} />
                <span className="text-sm text-green-600">{extension.department}</span>
              </div>
            </div>
            
            <div className="mt-2 space-y-3">
              {extension.businessHoursForwarding.length > 0 && (
                <div data-testid={`business-hours-group-${extension.id}`}>
                  <div className="mb-1">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">Business Hours Forwarding Numbers</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {extension.businessHoursForwarding.map((num, idx) => (
                      <div key={`bh-${idx}`} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-600">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {extension.afterHoursForwarding.length > 0 && (
                <div data-testid={`after-hours-group-${extension.id}`}>
                  <div className="mb-1">
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">After Hours Forwarding Numbers</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {extension.afterHoursForwarding.map((num, idx) => (
                      <div key={`ah-${idx}`} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-600">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => onEdit(extension)}
            className="text-sm text-gray-600 hover:text-gray-900"
            data-testid={`button-edit-extension-${extension.id}`}
          >
            Edit
          </button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVoicemail(extension)}
              className="text-gray-600"
              data-testid={`button-voicemail-${extension.id}`}
            >
              <Voicemail className="h-4 w-4 mr-1.5" />
              Voicemail
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCallLog(extension)}
              className="text-gray-600"
              data-testid={`button-call-log-${extension.id}`}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Call Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface YourExtensionsProps {
  extensions: Extension[];
  onEdit: (ext: Extension) => void;
  onVoicemail: (ext: Extension) => void;
  onCallLog: (ext: Extension) => void;
}

function YourExtensions({ extensions, onEdit, onVoicemail, onCallLog }: YourExtensionsProps) {
  return (
    <Card className="p-5" data-testid="your-extensions-card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4" data-testid="heading-your-extensions">Your Extensions</h2>
      
      <div>
        {extensions.map((ext) => (
          <ExtensionCard
            key={ext.id}
            extension={ext}
            onEdit={onEdit}
            onVoicemail={onVoicemail}
            onCallLog={onCallLog}
          />
        ))}
      </div>
    </Card>
  );
}

interface ActiveAddonsProps {
  addons: ActiveAddon[];
  onViewInstructions: (addon: ActiveAddon) => void;
  onEdit: (addon: ActiveAddon) => void;
}

function ActiveAddons({ addons, onViewInstructions, onEdit }: ActiveAddonsProps) {
  return (
    <Card className="p-5" data-testid="active-addons-card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4" data-testid="heading-active-addons">Active Addons</h2>
      
      <div className="space-y-3">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className="flex items-center justify-between py-2"
            data-testid={`active-addon-${addon.id}`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{addon.name}</span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2">
              {addon.hasInstructions && (
                <button
                  onClick={() => onViewInstructions(addon)}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  aria-label={`View instructions for ${addon.name}`}
                  data-testid={`button-view-instructions-${addon.id}`}
                >
                  View Instructions
                  <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              {addon.hasEdit && (
                <button
                  onClick={() => onEdit(addon)}
                  className="text-sm text-[#E53935] hover:underline"
                  data-testid={`button-edit-addon-${addon.id}`}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface ExploreAddonsProps {
  addons: ExploreAddon[];
  onAdd: (addon: ExploreAddon) => void;
}

function ExploreAddons({ addons, onAdd }: ExploreAddonsProps) {
  return (
    <Card className="p-5" data-testid="explore-addons-card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4" data-testid="heading-explore-addons">Trending Addons</h2>
      
      <div className="space-y-4">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className="relative rounded-lg overflow-hidden h-28"
            style={{
              backgroundImage: addon.imageUrl ? `url(${addon.imageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              backgroundColor: '#374151',
            }}
            data-testid={`explore-addon-${addon.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />
            <div className="relative z-10 p-4 flex items-center justify-between h-full">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{addon.name}</span>
                  <button aria-label={`More info about ${addon.name}`} className="cursor-pointer">
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-300" />
                  </button>
                </div>
                <p className="text-sm text-gray-300">{addon.description}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAdd(addon)}
                className="bg-gray-600/80 hover:bg-gray-600 text-white"
                data-testid={`button-add-addon-${addon.id}`}
              >
                Add <Plus className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Bundle Promotion Banner Component
interface BundlePromoBannerProps {
  onViewBundles: () => void;
}

function BundlePromoBanner({ onViewBundles }: BundlePromoBannerProps) {
  return (
    <div 
      className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#1a1a2e] via-[#2d2d4a] to-[#1a1a2e] p-6 mb-6"
      data-testid="bundle-promo-banner"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#36bff9] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#36bff9]/20 p-3 rounded-lg">
            <Package className="h-8 w-8 text-[#36bff9]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white">Save More with Bundles</h3>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Up to 30% Off
              </Badge>
            </div>
            <p className="text-gray-300 text-sm">
              Upgrade your plan to unlock premium add-ons and save up to $50/month with our bundle packages.
            </p>
          </div>
        </div>
        
        <Button
          onClick={onViewBundles}
          className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white shrink-0"
          data-testid="button-view-bundles"
        >
          View Bundles
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Marketplace Addons Grid Component
interface MarketplaceAddonsGridProps {
  addons: MarketplaceAddon[];
  includedAddonIds: string[];
  activeAddonIds: string[];
  onAddToPlan: (addon: MarketplaceAddon) => void;
  onRemoveFromPlan: (addon: MarketplaceAddon) => void;
  onRemoveBundleFeature: (addon: MarketplaceAddon) => void;
  currentPlanName: string;
}

function MarketplaceAddonsGrid({ 
  addons, 
  includedAddonIds,
  activeAddonIds,
  onAddToPlan, 
  onRemoveFromPlan,
  onRemoveBundleFeature,
  currentPlanName,
}: MarketplaceAddonsGridProps) {
  const [expandedAddons, setExpandedAddons] = useState<Set<string>>(new Set());

  const toggleExpanded = (addonId: string) => {
    setExpandedAddons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(addonId)) {
        newSet.delete(addonId);
      } else {
        newSet.add(addonId);
      }
      return newSet;
    });
  };

  // Helper to get addon status
  const getStatus = (addonId: string): AddonStatus => {
    if (includedAddonIds.includes(addonId)) return 'included';
    if (activeAddonIds.includes(addonId)) return 'active';
    return 'available';
  };

  const sortedAddons = useMemo(() => {
    const priorityOrder: Record<string, number> = {
      'callout': 1,
      'toll-free': 2,
      'supervised-transfer': 3,
      'message-taking': 4,
      'appointment-scheduling': 5,
      'texting': 6,
      'call-recording': 7,
      'additional-extensions': 8,
      'fax-out': 9,
      'conf-bridge': 10,
      'int-transfer': 11,
      'call-log': 12,
    };

    return [...addons]
      .filter(addon => addon.category === 'phone')
      .sort((a, b) => {
        // Sort order: included > active > available
        const statusOrder = { included: 0, active: 1, available: 2 };
        const aStatus = includedAddonIds.includes(a.id) ? 'included' : activeAddonIds.includes(a.id) ? 'active' : 'available';
        const bStatus = includedAddonIds.includes(b.id) ? 'included' : activeAddonIds.includes(b.id) ? 'active' : 'available';
        if (aStatus !== bStatus) return statusOrder[aStatus] - statusOrder[bStatus];
        
        const aPriority = priorityOrder[a.id] ?? 999;
        const bPriority = priorityOrder[b.id] ?? 999;
        return aPriority - bPriority;
      });
  }, [addons, includedAddonIds, activeAddonIds]);

  return (
    <div data-testid="marketplace-addons-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900" data-testid="heading-marketplace-addons">
          Phone System Add-ons
        </h2>
        <span className="text-sm text-gray-500" data-testid="current-plan-indicator">
          Current Plan: <span className="font-medium text-gray-700">{currentPlanName}</span>
        </span>
      </div>

      <div>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-testid="marketplace-addons-grid"
        >
          {sortedAddons.map((addon) => {
            const status = getStatus(addon.id);
            const isExpanded = expandedAddons.has(addon.id);

            return (
              <div
                key={addon.id}
                className={`rounded-lg border transition-all ${
                  status === 'included'
                    ? 'border-blue-200 bg-blue-50'
                    : status === 'active'
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
                data-testid={`marketplace-addon-card-${addon.id}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{addon.name}</h4>
                    {status === 'included' ? (
                      <Badge className="bg-blue-100 text-blue-700 border-0" data-testid={`badge-included-${addon.id}`}>
                        <Lock className="h-3 w-3 mr-1" />
                        Included
                      </Badge>
                    ) : status === 'active' ? (
                      <Badge className="bg-green-100 text-green-700 border-0" data-testid={`badge-active-${addon.id}`}>
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : addon.packages && addon.packages.length > 0 ? (
                      <span className="font-semibold text-gray-900">
                        From ${addon.packages[0].price}/mo
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        ${addon.price}/mo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{addon.description}</p>
                  
                  <button
                    onClick={() => toggleExpanded(addon.id)}
                    className="text-sm text-[#36bff9] hover:text-[#2aa8e0] flex items-center gap-1 mb-3"
                    data-testid={`button-learn-more-${addon.id}`}
                  >
                    {isExpanded ? (
                      <>
                        Show less
                        <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Learn more
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>

                  {isExpanded && addon.detailedDescription && (
                    <div 
                      className="text-sm text-gray-600 bg-gray-50 rounded-md p-3 mb-3 border border-gray-100"
                      data-testid={`addon-details-${addon.id}`}
                    >
                      {addon.detailedDescription}
                    </div>
                  )}

                  {status === 'included' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveBundleFeature(addon)}
                      className="w-full border-amber-200 text-amber-600 hover:bg-amber-50"
                      data-testid={`button-remove-bundle-feature-${addon.id}`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove Feature
                    </Button>
                  ) : status === 'active' ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveFromPlan(addon)}
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        data-testid={`button-remove-${addon.id}`}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full bg-[#36bff9] hover:bg-[#2aa8e0]"
                      onClick={() => onAddToPlan(addon)}
                      data-testid={`button-add-to-plan-${addon.id}`}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Plan
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Add to Plan Confirmation Dialog
interface AddToPlanDialogProps {
  open: boolean;
  onClose: () => void;
  addon: MarketplaceAddon | null;
  onConfirm: () => void;
  isLoading: boolean;
}

function AddToPlanDialog({ open, onClose, addon, onConfirm, isLoading }: AddToPlanDialogProps) {
  if (!addon) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="add-to-plan-dialog">
        <DialogHeader>
          <DialogTitle>Add {addon.name} to Your Plan</DialogTitle>
          <DialogDescription>
            This add-on will be added to your monthly subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{addon.name}</span>
              <span className="font-semibold text-gray-900">
                ${addon.packages && addon.packages.length > 0 ? addon.packages[0].price : addon.price}/mo
              </span>
            </div>
            <p className="text-sm text-gray-600">{addon.description}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Monthly Impact</span>
              <span className="font-semibold text-green-600">
                +${addon.packages && addon.packages.length > 0 ? addon.packages[0].price : addon.price}/mo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Changes will take effect immediately and be reflected on your next billing cycle.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-testid="button-cancel-add">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-[#36bff9] hover:bg-[#2aa8e0]"
            data-testid="button-confirm-add"
          >
            {isLoading ? 'Adding...' : 'Add to Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Remove Addon Confirmation Dialog
interface RemoveAddonDialogProps {
  open: boolean;
  onClose: () => void;
  addon: MarketplaceAddon | null;
  onConfirm: () => void;
  isLoading: boolean;
}

function RemoveAddonDialog({ open, onClose, addon, onConfirm, isLoading }: RemoveAddonDialogProps) {
  if (!addon) return null;

  const price = addon.packages && addon.packages.length > 0 ? addon.packages[0].price : addon.price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="remove-addon-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Remove {addon.name}?
          </DialogTitle>
          <DialogDescription>
            This add-on will be removed from your monthly subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{addon.name}</span>
              <span className="font-semibold text-red-600">
                -${price}/mo
              </span>
            </div>
            <p className="text-sm text-gray-600">{addon.description}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Monthly Savings</span>
              <span className="font-semibold text-green-600">
                -${price}/mo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Changes will take effect immediately. You can re-add this add-on anytime from the marketplace.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-testid="button-cancel-remove">
            Keep Add-on
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            variant="destructive"
            data-testid="button-confirm-remove"
          >
            {isLoading ? 'Removing...' : 'Remove from Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Bundle Feature Removal Warning Dialog
interface BundleRemovalWarningDialogProps {
  open: boolean;
  onClose: () => void;
  addon: MarketplaceAddon | null;
  currentBundle: Bundle | null;
  currentPlanName: string;
  currentPlanPrice: number;
  onConfirm: () => void;
  isLoading: boolean;
}

function BundleRemovalWarningDialog({ 
  open, 
  onClose, 
  addon, 
  currentBundle,
  currentPlanName,
  currentPlanPrice,
  onConfirm, 
  isLoading 
}: BundleRemovalWarningDialogProps) {
  if (!addon || !currentBundle) return null;

  const featureKey = addonToFeatureMap[addon.id];
  if (!featureKey) return null;

  const { newPrice, breakdown } = calculatePriceAfterRemoval(currentBundle, featureKey);
  const priceDifference = newPrice - currentPlanPrice;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" data-testid="bundle-removal-warning-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Important: Plan Change Required
          </DialogTitle>
          <DialogDescription>
            This feature is included in your current plan. Removing it will change your pricing.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">What will happen:</h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>Your plan will change from <strong>{currentPlanName}</strong> to <strong>The Essentials</strong></li>
              <li>The <strong>{addon.name}</strong> feature will be removed</li>
              <li>Other bundle features will be added as individual add-ons</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">New Monthly Pricing</h4>
            <div className="space-y-2">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-900">${item.price}/mo</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-medium text-gray-900">New Total</span>
                <span className="font-bold text-gray-900">${newPrice}/mo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm bg-gray-100 rounded-lg p-3">
            <div>
              <span className="text-gray-600">Current: </span>
              <span className="font-medium">${currentPlanPrice}/mo</span>
            </div>
            <div>
              <span className="text-gray-600">New: </span>
              <span className="font-medium">${newPrice}/mo</span>
            </div>
            <div className={priceDifference > 0 ? 'text-red-600' : 'text-green-600'}>
              {priceDifference > 0 ? '+' : ''}{priceDifference === 0 ? 'No change' : `$${priceDifference}/mo`}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-testid="button-cancel-bundle-removal">
            Keep My Plan
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            variant="destructive"
            data-testid="button-confirm-bundle-removal"
          >
            {isLoading ? 'Processing...' : 'Remove Feature & Change Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Modals
interface EditExtensionModalProps {
  open: boolean;
  onClose: () => void;
  extension: Extension | null;
  onSave: (extension: Extension) => void;
  onEditVoicemailGreeting: () => void;
}

function EditExtensionModal({ open, onClose, extension, onSave, onEditVoicemailGreeting }: EditExtensionModalProps) {
  const [formData, setFormData] = useState<Extension | null>(null);
  const [disableForwarding, setDisableForwarding] = useState(false);
  const [afterHoursExpanded, setAfterHoursExpanded] = useState(false);

  useEffect(() => {
    if (extension) {
      setFormData({ ...extension });
      setAfterHoursExpanded(extension.afterHoursForwarding.length > 0);
    }
  }, [extension]);

  if (!formData) return null;

  const updateBusinessHoursNumber = (index: number, value: string) => {
    const newNumbers = [...formData.businessHoursForwarding];
    newNumbers[index] = value;
    setFormData({ ...formData, businessHoursForwarding: newNumbers });
  };

  const updateAfterHoursNumber = (index: number, value: string) => {
    const newNumbers = [...formData.afterHoursForwarding];
    newNumbers[index] = value;
    setFormData({ ...formData, afterHoursForwarding: newNumbers });
  };

  const addBusinessHoursNumber = () => {
    if (formData.businessHoursForwarding.length < 4) {
      setFormData({ ...formData, businessHoursForwarding: [...formData.businessHoursForwarding, ''] });
    }
  };

  const addAfterHoursNumber = () => {
    if (formData.afterHoursForwarding.length < 4) {
      setFormData({ ...formData, afterHoursForwarding: [...formData.afterHoursForwarding, ''] });
    }
  };

  const removeBusinessHoursNumber = (index: number) => {
    const newNumbers = formData.businessHoursForwarding.filter((_, i) => i !== index);
    setFormData({ ...formData, businessHoursForwarding: newNumbers.length > 0 ? newNumbers : [''] });
  };

  const removeAfterHoursNumber = (index: number) => {
    const newNumbers = formData.afterHoursForwarding.filter((_, i) => i !== index);
    setFormData({ ...formData, afterHoursForwarding: newNumbers });
    if (newNumbers.length === 0) {
      setAfterHoursExpanded(false);
    }
  };

  const expandAfterHours = () => {
    setAfterHoursExpanded(true);
    if (formData.afterHoursForwarding.length === 0) {
      setFormData({ ...formData, afterHoursForwarding: [''] });
    }
  };

  const hasBusinessHours = formData.businessHoursForwarding.some(n => n.trim() !== '');
  const hasAfterHours = formData.afterHoursForwarding.some(n => n.trim() !== '');

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="edit-extension-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg font-semibold">Edit extension</DialogTitle>
                  {hasBusinessHours && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid="badge-has-business-hours">
                      Business Hours
                    </Badge>
                  )}
                  {hasAfterHours && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200" data-testid="badge-has-after-hours">
                      After Hours
                    </Badge>
                  )}
                </div>
                <DialogDescription className="text-sm text-gray-500">{formData.firstName} {formData.lastName} (Ext. {formData.id})</DialogDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditVoicemailGreeting}
              data-testid="button-edit-voicemail-greeting"
            >
              <Voicemail className="h-4 w-4 mr-1.5" />
              Edit Voicemail Greeting
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1.5 h-10"
                data-testid="input-first-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1.5 h-10"
                data-testid="input-last-name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department:</Label>
              <Input
                id="department"
                placeholder="Type Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="mt-1.5 h-10"
                data-testid="input-department"
              />
            </div>
            <div>
              <Label htmlFor="voicemailEmail">Voicemail to email address:</Label>
              <Input
                id="voicemailEmail"
                type="email"
                placeholder="Type email"
                value={formData.voicemailEmail}
                onChange={(e) => setFormData({ ...formData, voicemailEmail: e.target.value })}
                className="mt-1.5 h-10"
                data-testid="input-voicemail-email"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium text-green-700">Business Hours Forwarding Numbers</Label>
                  <p className="text-sm text-gray-500 mt-0.5">Numbers that receive calls during your business hours</p>
                </div>
                {formData.businessHoursForwarding.length < 4 && (
                  <button
                    onClick={addBusinessHoursNumber}
                    className="flex items-center gap-1 text-sm text-[var(--blue-light700)] hover:underline"
                    data-testid="button-add-business-hours-number"
                  >
                    <Plus className="h-4 w-4" />
                    Add Number
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {formData.businessHoursForwarding.map((num, idx) => (
                  <div key={idx}>
                    <Label className="text-sm text-gray-500">Forwarding Number {idx + 1}</Label>
                    <div className="flex gap-2 mt-1">
                      <Select defaultValue="US">
                        <SelectTrigger className="w-20 h-10" data-testid={`select-business-country-${idx}`}>
                          <SelectValue placeholder="US" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">US</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                          <SelectItem value="CA">CA</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="(561) 000 - 0000"
                        value={num}
                        onChange={(e) => updateBusinessHoursNumber(idx, e.target.value)}
                        disabled={disableForwarding}
                        className="h-10"
                        data-testid={`input-business-forwarding-${idx}`}
                      />
                      {formData.businessHoursForwarding.length > 1 && (
                        <button
                          onClick={() => removeBusinessHoursNumber(idx)}
                          className="text-gray-400 hover:text-red-500"
                          data-testid={`button-remove-business-${idx}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              {!afterHoursExpanded ? (
                <button
                  onClick={expandAfterHours}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  data-testid="button-expand-after-hours"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add After Hours Forwarding Numbers</span>
                </button>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium text-blue-700">After Hours Forwarding Numbers</Label>
                      <p className="text-sm text-gray-500 mt-0.5">Numbers that receive calls outside of business hours</p>
                    </div>
                    {formData.afterHoursForwarding.length < 4 && (
                      <button
                        onClick={addAfterHoursNumber}
                        className="flex items-center gap-1 text-sm text-[var(--blue-light700)] hover:underline"
                        data-testid="button-add-after-hours-number"
                      >
                        <Plus className="h-4 w-4" />
                        Add Number
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {formData.afterHoursForwarding.map((num, idx) => (
                      <div key={idx}>
                        <Label className="text-sm text-gray-500">Forwarding Number {idx + 1}</Label>
                        <div className="flex gap-2 mt-1">
                          <Select defaultValue="US">
                            <SelectTrigger className="w-20 h-10" data-testid={`select-after-hours-country-${idx}`}>
                              <SelectValue placeholder="US" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">US</SelectItem>
                              <SelectItem value="UK">UK</SelectItem>
                              <SelectItem value="CA">CA</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="(561) 000 - 0000"
                            value={num}
                            onChange={(e) => updateAfterHoursNumber(idx, e.target.value)}
                            disabled={disableForwarding}
                            className="h-10"
                            data-testid={`input-after-hours-forwarding-${idx}`}
                          />
                          <button
                            onClick={() => removeAfterHoursNumber(idx)}
                            className="text-gray-400 hover:text-red-500"
                            data-testid={`button-remove-after-hours-${idx}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-2 pt-2">
            <Checkbox
              id="disableForwarding"
              checked={disableForwarding}
              onCheckedChange={(checked) => setDisableForwarding(checked as boolean)}
              data-testid="checkbox-disable-forwarding"
            />
            <div>
              <Label htmlFor="disableForwarding" className="font-medium">
                Disable Call Forwarding
              </Label>
              <p className="text-sm text-gray-500">
                (When disabled, transferred calls will go straight to voicemail)
              </p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleSave}
          className="w-full mt-4 bg-[var(--blue-light700)] hover:bg-[#015A89] text-white"
          data-testid="button-save-extension"
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface VoicemailGreetingModalProps {
  open: boolean;
  onClose: () => void;
  extension: Extension | null;
  onRecordNew: () => void;
}

function VoicemailGreetingModal({ open, onClose, extension, onRecordNew }: VoicemailGreetingModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(32);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In real app, would control audio playback here
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm" data-testid="voicemail-greeting-modal">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Voicemail className="h-5 w-5 text-gray-600" />
            <DialogTitle>Voicemail Greeting</DialogTitle>
          </div>
          <DialogDescription className="sr-only">Listen to or record a new voicemail greeting</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              aria-label={isPlaying ? 'Pause voicemail greeting' : 'Play voicemail greeting'}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-gray-700" />
              ) : (
                <Play className="h-4 w-4 text-gray-700" />
              )}
            </button>
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded-full">
                <div
                  className="h-1.5 bg-gray-400 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <Button
            onClick={onRecordNew}
            className="w-full bg-[var(--blue-light700)] hover:bg-[#015A89] text-white"
            data-testid="button-record-new-greeting"
          >
            <Mic className="h-4 w-4 mr-2" />
            Record New Greeting
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            data-testid="button-close-voicemail"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface RecordVoicemailModalProps {
  open: boolean;
  onClose: () => void;
  extension: Extension | null;
}

function RecordVoicemailModal({ open, onClose, extension }: RecordVoicemailModalProps) {
  const [selectedNumber, setSelectedNumber] = useState<'existing' | 'other'>('existing');
  const [otherNumber, setOtherNumber] = useState('');
  const { toast } = useToast();

  const handleCallMeNow = () => {
    toast({
      title: 'Calling...',
      description: 'You will receive a call shortly to record your greeting.',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="record-voicemail-modal">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Voicemail className="h-6 w-6 text-gray-600" />
          </div>
          <DialogTitle className="text-xl">Record Your Voicemail Greeting</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600 mt-2 px-4">
            Please select or enter the phone number you would like the system to call you to change your company greeting. Once you click the Call Me button below, wait a few seconds. When your phone rings, answer it, listen to the prompt and record your message. When finished, simply hang up. Please wait 30 seconds before checking your greeting on the "Listen to my current voicemail greeting button"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedNumber === 'existing' ? 'border-[#E53935] bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedNumber('existing')}
            data-testid="option-existing-number"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selectedNumber === 'existing' ? 'border-[#E53935]' : 'border-gray-300'
            }`}>
              {selectedNumber === 'existing' && (
                <div className="w-2 h-2 rounded-full bg-[#E53935]" />
              )}
            </div>
            <span className="text-gray-700">{extension?.businessHoursForwarding[0] || businessPhoneNumber}</span>
          </div>
          
          <div
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedNumber === 'other' ? 'border-[#E53935] bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedNumber('other')}
            data-testid="option-other-number"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selectedNumber === 'other' ? 'border-[#E53935]' : 'border-gray-300'
            }`}>
              {selectedNumber === 'other' && (
                <div className="w-2 h-2 rounded-full bg-[#E53935]" />
              )}
            </div>
            <Input
              placeholder="Enter other number"
              value={otherNumber}
              onChange={(e) => setOtherNumber(e.target.value)}
              className="border-0 p-0 h-auto focus-visible:ring-0"
              onClick={(e) => e.stopPropagation()}
              data-testid="input-other-number"
            />
          </div>
        </div>
        
        <Button
          onClick={handleCallMeNow}
          className="w-full mt-4 bg-[var(--blue-light700)] hover:bg-[#015A89] text-white"
          data-testid="button-call-me-now"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Me Now
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Main Page Component
export default function PhoneSystemPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('phone-system');
  const [extensions, setExtensions] = useState<Extension[]>(mockExtensions);
  const [activeAddons] = useState<ActiveAddon[]>(mockActiveAddons);
  const [exploreAddons] = useState<ExploreAddon[]>(mockExploreAddons);
  
  // Use contexts for add-ons and subscription
  const { activeAddons: contextAddons, addAddon, removeAddon, isAddonActive, getAddonStatus } = useAddons();
  const { includedAddonIds, currentPlanName, currentBundle, basePlanAmount, isAddonIncluded, updatePlan } = useSubscription();
  
  // Derive activeAddonIds from context (separately purchased add-ons, not included in bundle)
  const activeAddonIds = useMemo(() => {
    return contextAddons
      .filter(addon => addon.status === 'active')
      .map(addon => addon.id);
  }, [contextAddons]);
  
  // Derive reusableAddons for ActiveAddonsList (synced with context + includes bundle features)
  const reusableAddons = useMemo(() => {
    return sampleAddons.map(addon => {
      const status = getAddonStatus(addon.id, includedAddonIds);
      return {
        ...addon,
        status: status === 'included' ? 'active' : status === 'active' ? 'active' : 'inactive'
      };
    }) as ReusableAddon[];
  }, [getAddonStatus, includedAddonIds]);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [voicemailModalOpen, setVoicemailModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
  
  // Add to plan dialog states
  const [addToPlanDialogOpen, setAddToPlanDialogOpen] = useState(false);
  const [selectedMarketplaceAddon, setSelectedMarketplaceAddon] = useState<MarketplaceAddon | null>(null);
  const [isAddingToPlan, setIsAddingToPlan] = useState(false);
  
  // Remove from plan dialog states
  const [removePlanDialogOpen, setRemovePlanDialogOpen] = useState(false);
  const [addonToRemove, setAddonToRemove] = useState<MarketplaceAddon | null>(null);
  const [isRemovingFromPlan, setIsRemovingFromPlan] = useState(false);
  
  // Bundle feature removal dialog states
  const [bundleRemovalDialogOpen, setBundleRemovalDialogOpen] = useState(false);
  const [bundleFeatureToRemove, setBundleFeatureToRemove] = useState<MarketplaceAddon | null>(null);
  const [isRemovingBundleFeature, setIsRemovingBundleFeature] = useState(false);
  
  const { toast } = useToast();

  // Handlers
  const handleEditExtension = (ext: Extension) => {
    setSelectedExtension(ext);
    setEditModalOpen(true);
  };

  const handleVoicemail = (ext: Extension) => {
    setSelectedExtension(ext);
    setVoicemailModalOpen(true);
  };

  const handleCallLog = (ext: Extension) => {
    toast({
      title: 'Call Log',
      description: `Opening call log for ${ext.firstName} ${ext.lastName}`,
    });
  };


  const handleSaveExtension = (ext: Extension) => {
    setExtensions(prev => prev.map(e => e.id === ext.id ? ext : e));
    toast({
      title: 'Extension Updated',
      description: 'Your extension settings have been saved.',
    });
  };

  const handleViewInstructions = (addon: ActiveAddon) => {
    toast({
      title: 'Instructions',
      description: `Viewing instructions for ${addon.name}`,
    });
  };

  const handleEditAddon = (addon: ActiveAddon) => {
    toast({
      title: 'Edit Add-on',
      description: `Editing ${addon.name}`,
    });
  };

  const handleReusableAddonUpdate = (addonId: string, config: ReusableAddon['config']) => {
    // Config updates are handled through context now
    toast({
      title: 'Settings Updated',
      description: 'Your add-on settings have been saved.',
    });
  };

  const handleReusableViewInstructions = (addon: ReusableAddon) => {
    toast({
      title: 'Instructions',
      description: `Viewing instructions for ${addon.name}`,
    });
  };

  const handleAddAddon = (addon: ExploreAddon) => {
    toast({
      title: 'Add Add-on',
      description: `Adding ${addon.name} to your plan`,
    });
  };

  const handleEditVoicemailGreeting = () => {
    setEditModalOpen(false);
    setVoicemailModalOpen(true);
  };

  const handleRecordNew = () => {
    setVoicemailModalOpen(false);
    setRecordModalOpen(true);
  };

  // Marketplace handlers
  const handleViewBundles = () => {
    router.push('/billing/plans');
  };

  const handleAddToPlan = (addon: MarketplaceAddon) => {
    setSelectedMarketplaceAddon(addon);
    setAddToPlanDialogOpen(true);
  };

  const handleConfirmAddToPlan = async () => {
    if (!selectedMarketplaceAddon) return;
    
    setIsAddingToPlan(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use context to add addon (pass the full addon object)
    addAddon(selectedMarketplaceAddon);
    
    setIsAddingToPlan(false);
    setAddToPlanDialogOpen(false);
    
    toast({
      title: 'Add-on Added!',
      description: `${selectedMarketplaceAddon.name} has been added to your monthly plan.`,
    });
    
    setSelectedMarketplaceAddon(null);
  };

  // Remove from plan handlers
  const handleRemoveFromPlan = (addon: MarketplaceAddon) => {
    setAddonToRemove(addon);
    setRemovePlanDialogOpen(true);
  };

  const handleConfirmRemoveFromPlan = async () => {
    if (!addonToRemove) return;
    
    setIsRemovingFromPlan(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use context to remove addon
    removeAddon(addonToRemove.id);
    
    setIsRemovingFromPlan(false);
    setRemovePlanDialogOpen(false);
    
    toast({
      title: 'Add-on Removed',
      description: `${addonToRemove.name} has been removed from your plan.`,
    });
    
    setAddonToRemove(null);
  };

  const handleManageAddon = (addon: MarketplaceAddon) => {
    toast({
      title: 'Manage Add-on',
      description: `Opening settings for ${addon.name}`,
    });
  };

  // Bundle feature removal handlers
  const handleRemoveBundleFeature = (addon: MarketplaceAddon) => {
    setBundleFeatureToRemove(addon);
    setBundleRemovalDialogOpen(true);
  };

  const handleConfirmRemoveBundleFeature = async () => {
    if (!bundleFeatureToRemove || !currentBundle) return;
    
    setIsRemovingBundleFeature(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get the feature key for this addon
    const featureKey = addonToFeatureMap[bundleFeatureToRemove.id];
    if (!featureKey) {
      setIsRemovingBundleFeature(false);
      return;
    }
    
    // Get remaining bundle features (excluding the one being removed)
    const remainingBundleFeatures = Object.entries(currentBundle.features)
      .filter(([key, value]) => 
        value === true && 
        key !== featureKey &&
        featureIndividualPrices[key as keyof Bundle['features']] > 0
      );
    
    // Convert remaining features to active add-ons
    remainingBundleFeatures.forEach(([key]) => {
      // Find the addon ID for this feature
      const addonEntry = Object.entries(addonToFeatureMap).find(([_, fKey]) => fKey === key);
      if (addonEntry) {
        const [addonId] = addonEntry;
        const addonData = availableAddons.find(a => a.id === addonId);
        if (addonData) {
          addAddon(addonData);
        }
      }
    });
    
    // Downgrade to Essentials plan
    updatePlan({
      id: ESSENTIALS_PLAN.id,
      name: ESSENTIALS_PLAN.name,
      tier: 'The Essentials',
      price: ESSENTIALS_PLAN.price,
    });
    
    setIsRemovingBundleFeature(false);
    setBundleRemovalDialogOpen(false);
    
    toast({
      title: 'Plan Changed',
      description: `${bundleFeatureToRemove.name} has been removed. Your plan has been updated to The Essentials with individual add-ons.`,
    });
    
    setBundleFeatureToRemove(null);
  };

  return (
    <div className="p-4 lg:p-8" data-testid="phone-system-page">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-phone-system">
        {companyName} Miami, FL Office
      </h1>
      
      {/* Top Navigation */}
      <div className="flex gap-2 mb-8">
        <Button
          variant={activeTab === 'phone-system' ? 'default' : 'outline'}
          onClick={() => setActiveTab('phone-system')}
          className={activeTab === 'phone-system' ? 'bg-gray-900 text-white' : ''}
          data-testid="tab-phone-system"
        >
          Phone System
        </Button>
        <Button
          variant={activeTab === 'add-ons' ? 'default' : 'outline'}
          onClick={() => setActiveTab('add-ons')}
          className={activeTab === 'add-ons' ? 'bg-gray-900 text-white' : ''}
          data-testid="tab-add-ons"
        >
          Add-ons
        </Button>
      </div>
      
      {activeTab === 'phone-system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - 50% width */}
          <div className="space-y-6">
            <PhoneDetails />
            <ActiveAddonsList
              addons={reusableAddons}
              onAddonUpdate={handleReusableAddonUpdate}
              onViewInstructions={handleReusableViewInstructions}
              title="Active Add-ons"
              showOnlyActive={true}
            />
          </div>
          
          {/* Right Column - 50% width */}
          <div>
            <YourExtensions
              extensions={extensions}
              onEdit={handleEditExtension}
              onVoicemail={handleVoicemail}
              onCallLog={handleCallLog}
            />
          </div>
        </div>
      )}
      
      {activeTab === 'add-ons' && (
        <div className="space-y-6" data-testid="addons-tab-content">
          {/* Bundle Promotion Banner */}
          <BundlePromoBanner onViewBundles={handleViewBundles} />
          
          {/* Marketplace Grid */}
          <MarketplaceAddonsGrid
            addons={availableAddons}
            includedAddonIds={includedAddonIds}
            activeAddonIds={activeAddonIds}
            onAddToPlan={handleAddToPlan}
            onRemoveFromPlan={handleRemoveFromPlan}
            onRemoveBundleFeature={handleRemoveBundleFeature}
            currentPlanName={currentPlanName}
          />
        </div>
      )}
      
      {/* Modals */}
      <EditExtensionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        extension={selectedExtension}
        onSave={handleSaveExtension}
        onEditVoicemailGreeting={handleEditVoicemailGreeting}
      />
      
      <VoicemailGreetingModal
        open={voicemailModalOpen}
        onClose={() => setVoicemailModalOpen(false)}
        extension={selectedExtension}
        onRecordNew={handleRecordNew}
      />
      
      <RecordVoicemailModal
        open={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        extension={selectedExtension}
      />
      
      {/* Add to Plan Confirmation Dialog */}
      <AddToPlanDialog
        open={addToPlanDialogOpen}
        onClose={() => {
          setAddToPlanDialogOpen(false);
          setSelectedMarketplaceAddon(null);
        }}
        addon={selectedMarketplaceAddon}
        onConfirm={handleConfirmAddToPlan}
        isLoading={isAddingToPlan}
      />
      
      {/* Remove from Plan Confirmation Dialog */}
      <RemoveAddonDialog
        open={removePlanDialogOpen}
        onClose={() => {
          setRemovePlanDialogOpen(false);
          setAddonToRemove(null);
        }}
        addon={addonToRemove}
        onConfirm={handleConfirmRemoveFromPlan}
        isLoading={isRemovingFromPlan}
      />
      
      {/* Bundle Feature Removal Warning Dialog */}
      <BundleRemovalWarningDialog
        open={bundleRemovalDialogOpen}
        onClose={() => {
          setBundleRemovalDialogOpen(false);
          setBundleFeatureToRemove(null);
        }}
        addon={bundleFeatureToRemove}
        currentBundle={currentBundle}
        currentPlanName={currentPlanName}
        currentPlanPrice={basePlanAmount}
        onConfirm={handleConfirmRemoveBundleFeature}
        isLoading={isRemovingBundleFeature}
      />
    </div>
  );
}
