'use client';

import { useState, useRef, useEffect } from 'react';
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
  Mic
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useToast } from '@/app/hooks/use-toast';

// Types
interface Extension {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  departmentColor: string;
  forwardingNumbers: string[];
  liveAnswering: boolean;
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
    forwardingNumbers: ['(561) 000 - 0000', '(561) 000 - 0000', '(561) 000 - 0000', '(561) 000 - 0000'],
    liveAnswering: true,
    voicemailEmail: 'john.smith@example.com',
    voicemailGreetingUrl: '/sample-greeting.mp3',
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Smith',
    department: 'Sales',
    departmentColor: 'green',
    forwardingNumbers: ['(561) 000 - 0000', '(561) 000 - 0000', '(561) 000 - 0000', '(561) 000 - 0000'],
    liveAnswering: true,
    voicemailEmail: 'john.sales@example.com',
    voicemailGreetingUrl: '/sample-greeting.mp3',
  },
];

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
type TabType = 'phone-system' | 'add-ons' | 'my-plan';

// Sub-components
function PhoneDetails() {
  const { toast } = useToast();
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [email, setEmail] = useState(faxToEmail);
  const [editingEmail, setEditingEmail] = useState(faxToEmail);
  
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
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid="badge-business-hours">
              Business Hours Line
            </Badge>
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
              className="bg-[#E53935] hover:bg-[#C62828] text-white"
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
  onToggleLiveAnswering: (ext: Extension, enabled: boolean) => void;
}

function ExtensionCard({ extension, onEdit, onVoicemail, onCallLog, onToggleLiveAnswering }: ExtensionCardProps) {
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
            
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {extension.forwardingNumbers.map((num, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">{num}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <Switch
                checked={extension.liveAnswering}
                onCheckedChange={(checked) => onToggleLiveAnswering(extension, checked)}
                className="data-[state=checked]:bg-green-500"
                aria-label={`Toggle live answering for ${extension.firstName} ${extension.lastName}`}
                data-testid={`switch-live-answering-${extension.id}`}
              />
              <span className="text-sm text-gray-600">Live Answering</span>
              <button aria-label="Learn more about Live Answering" className="cursor-pointer">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
              </button>
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
  onToggleLiveAnswering: (ext: Extension, enabled: boolean) => void;
}

function YourExtensions({ extensions, onEdit, onVoicemail, onCallLog, onToggleLiveAnswering }: YourExtensionsProps) {
  return (
    <Card className="p-5" data-testid="your-extensions-card">
      <h2 className="text-lg font-semibold text-gray-900 mb-1" data-testid="heading-your-extensions">Your Extensions</h2>
      <p className="text-sm text-gray-500 mb-4">
        *To get a verification call or bypass live answering, simply turn off live answering.
      </p>
      
      <div>
        {extensions.map((ext) => (
          <ExtensionCard
            key={ext.id}
            extension={ext}
            onEdit={onEdit}
            onVoicemail={onVoicemail}
            onCallLog={onCallLog}
            onToggleLiveAnswering={onToggleLiveAnswering}
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4" data-testid="heading-explore-addons">Explore Addons</h2>
      
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

  useEffect(() => {
    if (extension) {
      setFormData({ ...extension });
    }
  }, [extension]);

  if (!formData) return null;

  const updateForwardingNumber = (index: number, value: string) => {
    const newNumbers = [...formData.forwardingNumbers];
    newNumbers[index] = value;
    setFormData({ ...formData, forwardingNumbers: newNumbers });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" data-testid="edit-extension-modal">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Phone className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Edit extension</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">{formData.firstName} {formData.lastName} (Ext. {formData.id})</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex justify-end mb-4">
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
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1.5"
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
                className="mt-1.5"
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
                className="mt-1.5"
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
                className="mt-1.5"
                data-testid="input-voicemail-email"
              />
            </div>
          </div>
          
          <div>
            <Label className="font-medium">Forwarding Numbers</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx}>
                  <Label className="text-sm text-gray-500">Forwarding Number {idx + 1}</Label>
                  <div className="flex gap-2 mt-1">
                    <Select defaultValue="US">
                      <SelectTrigger className="w-20" data-testid={`select-country-${idx}`}>
                        <SelectValue placeholder="US" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={formData.forwardingNumbers[idx] || ''}
                      onChange={(e) => updateForwardingNumber(idx, e.target.value)}
                      disabled={disableForwarding}
                      data-testid={`input-forwarding-${idx}`}
                    />
                  </div>
                </div>
              ))}
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
          className="w-full mt-4 bg-[#E53935] hover:bg-[#C62828] text-white"
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
            className="w-full bg-[#E53935] hover:bg-[#C62828] text-white"
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
            <span className="text-gray-700">{extension?.forwardingNumbers[0] || businessPhoneNumber}</span>
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
          className="w-full mt-4 bg-[#E53935] hover:bg-[#C62828] text-white"
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
  const [activeTab, setActiveTab] = useState<TabType>('phone-system');
  const [extensions, setExtensions] = useState<Extension[]>(mockExtensions);
  const [activeAddons] = useState<ActiveAddon[]>(mockActiveAddons);
  const [exploreAddons] = useState<ExploreAddon[]>(mockExploreAddons);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [voicemailModalOpen, setVoicemailModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
  
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

  const handleToggleLiveAnswering = (ext: Extension, enabled: boolean) => {
    setExtensions(prev => prev.map(e => 
      e.id === ext.id ? { ...e, liveAnswering: enabled } : e
    ));
    toast({
      title: enabled ? 'Live Answering Enabled' : 'Live Answering Disabled',
      description: enabled 
        ? 'Calls will be answered by a live receptionist.'
        : 'Calls will ring your phones directly or go to voicemail.',
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
        <Button
          variant={activeTab === 'my-plan' ? 'default' : 'outline'}
          onClick={() => setActiveTab('my-plan')}
          className={activeTab === 'my-plan' ? 'bg-gray-900 text-white' : ''}
          data-testid="tab-my-plan"
        >
          My Plan
        </Button>
      </div>
      
      {activeTab === 'phone-system' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 1/3 width */}
          <div className="lg:col-span-1 space-y-6">
            <PhoneDetails />
            <ActiveAddons
              addons={activeAddons}
              onViewInstructions={handleViewInstructions}
              onEdit={handleEditAddon}
            />
            <ExploreAddons
              addons={exploreAddons}
              onAdd={handleAddAddon}
            />
          </div>
          
          {/* Right Column - 2/3 width */}
          <div className="lg:col-span-2">
            <YourExtensions
              extensions={extensions}
              onEdit={handleEditExtension}
              onVoicemail={handleVoicemail}
              onCallLog={handleCallLog}
              onToggleLiveAnswering={handleToggleLiveAnswering}
            />
          </div>
        </div>
      )}
      
      {activeTab === 'add-ons' && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Add-ons Marketplace</h2>
          <p className="text-gray-500">Browse and purchase additional features for your phone system.</p>
        </div>
      )}
      
      {activeTab === 'my-plan' && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Plan</h2>
          <p className="text-gray-500">View and manage your billing, package, and entitlements.</p>
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
    </div>
  );
}
