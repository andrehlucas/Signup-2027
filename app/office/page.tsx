'use client';

import { useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserType } from '../../shared/schema';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Share2, 
  Upload, 
  FileText, 
  X, 
  ChevronDown,
  Info,
  Mail,
  Headphones,
  PhoneForwarded,
  Voicemail,
  FileEdit
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { ExpandLocationBanner } from '@/app/portal-components/ExpandLocationBanner';

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

const packageFeatures = [
  { icon: MapPin, label: 'Prestigious Business Address' },
  { icon: Headphones, label: 'Professional Live Call Answering' },
  { icon: PhoneForwarded, label: 'Personalized Call Transferring' },
  { icon: Voicemail, label: 'Voicemail/Fax Converted to Email' },
  { icon: Phone, label: 'Business Phone/Fax Number' },
  { icon: FileEdit, label: 'Professional Mail Receipt' },
];

export default function OfficePage() {
  const { data: user } = useQuery<UserType>({
    queryKey: ['/api/user']
  });

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightUpload, setHighlightUpload] = useState(false);
  const [mailScanningOpen, setMailScanningOpen] = useState(false);
  const [scanningPreferences, setScanningPreferences] = useState({
    autoScan: true,
    emailNotifications: true,
    scanFrequency: 'daily',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const officeAddress = '848 Brickell Avenue, Penthouse 5';
  const officeCity = 'Miami FL 33131';
  const fullAddress = `${officeAddress}, ${officeCity}`;
  const companyName = user?.businessName || 'Acme Corporation';

  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(fullAddress);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Office Location',
      text: `Check out our office at ${fullAddress}`,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(`${fullAddress}\n${shareData.url}`);
        }
      }
    } else {
      navigator.clipboard.writeText(`${fullAddress}\n${shareData.url}`);
    }
  };

  const handleMailForwardingClick = () => {
    setHighlightUpload(true);
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setHighlightUpload(false), 3000);
  };

  const simulateUpload = (file: File) => {
    const newFile: UploadingFile = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
    };

    setUploadingFiles((prev) => [...prev, newFile]);

    const interval = setInterval(() => {
      setUploadingFiles((prev) =>
        prev.map((f) => {
          if (f.id === newFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress >= 100 ? 'complete' : 'uploading',
            };
          }
          return f;
        })
      );
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === newFile.id ? { ...f, progress: 100, status: 'complete' } : f
        )
      );
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(simulateUpload);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(simulateUpload);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="p-4 lg:p-8" data-testid="office-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-office">
        {companyName} Miami, FL Office
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-xl overflow-hidden h-[280px]">
              <img
                src="/office-building_1761587957783.webp"
                alt="Office Building"
                className="w-full h-full object-cover"
                data-testid="img-building"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-[280px] bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.6595159366707!2d-80.19180492441!3d25.76168277735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b69c20e3f7c9%3A0x9e9b2d99b7c12d83!2s848%20Brickell%20Ave%2C%20Miami%2C%20FL%2033131!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
                data-testid="map-iframe"
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Your Office Package Includes:</h3>
          <div className="space-y-3">
            {packageFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3" data-testid={`feature-${idx}`}>
                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-[#2e7d32]" />
                </div>
                <span className="text-sm text-gray-700">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="address-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your physical office address is:</h2>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <p className="font-medium text-gray-900" data-testid="text-address">{officeAddress}</p>
              <p className="text-gray-600">{officeCity}</p>
              <button 
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-1"
                data-testid="button-change-location"
              >
                Change Location <Info className="h-3 w-3" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32] hover:bg-[#c8e6c9]"
                onClick={handleGetDirections}
                data-testid="button-get-directions"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button
                className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white"
                onClick={handleShare}
                data-testid="button-share"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Mail Forwarding</h3>
                <p className="text-sm text-[#d92d20]">
                  To enable mail forwarding, please upload mandatory documents of: 2 forms of ID and USPS1583
                </p>
              </div>
              <button
                className="text-sm text-gray-900 hover:text-[#36bff9] font-medium whitespace-nowrap"
                onClick={handleMailForwardingClick}
                data-testid="button-mail-forwarding"
              >
                Click Here
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <h3 className="font-medium text-gray-900">Mail Scanning</h3>
              <button
                className="text-sm text-gray-900 hover:text-[#36bff9] font-medium"
                onClick={() => setMailScanningOpen(true)}
                data-testid="button-mail-scanning"
              >
                Setup
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <h3 className="font-medium text-gray-900">Need a Verification Letter?</h3>
              <button
                className="text-sm text-gray-900 hover:text-[#36bff9] font-medium"
                data-testid="button-download-verification-letter"
              >
                Click here to download
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={uploadSectionRef}
          className={`bg-white rounded-xl border-2 p-6 transition-all duration-500 ${
            highlightUpload 
              ? 'border-[#36bff9] shadow-lg shadow-[#36bff9]/20' 
              : 'border-gray-200'
          }`}
          data-testid="document-upload-card"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Document Upload</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload two forms of ID: one primary with a photo and one secondary showing your address. 
            Also upload the USPS 1583 Form to authorize mail handling.
          </p>
          
          <p className="text-sm text-[#36bff9] cursor-pointer hover:underline" data-testid="link-1583">
            Click here to use our onboarding system and fillup the 1583 digitally
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Once completed, download the file and upload using the option below.
          </p>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-[#36bff9] bg-[#e0f7fa]' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            data-testid="dropzone"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Upload className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600">
                <button
                  className="text-[#36bff9] hover:underline font-medium"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-click-upload"
                >
                  Click to upload
                </button>
                {' '}or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG, GIF or PDF (max. 800×400px)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                className="hidden"
                onChange={handleFileSelect}
                data-testid="input-file"
              />
            </div>
          </div>

          {uploadingFiles.length > 0 && (
            <div className="mt-4 space-y-3">
              {uploadingFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  data-testid={`file-item-${file.id}`}
                >
                  <div className="w-10 h-10 rounded bg-[#fee2e2] flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#dc2626]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.status === 'uploading' && (
                        <>
                          <span>•</span>
                          <Upload className="h-3 w-3 animate-pulse" />
                          <span>Uploading...</span>
                        </>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={file.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-gray-500 w-10 text-right">
                        {Math.round(file.progress)}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    data-testid={`button-remove-file-${file.id}`}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <ExpandLocationBanner onAddLocation={() => console.log('Add location clicked')} />
      </div>

      <Dialog open={mailScanningOpen} onOpenChange={setMailScanningOpen}>
        <DialogContent className="sm:max-w-md" data-testid="mail-scanning-modal">
          <DialogHeader>
            <DialogTitle>Mail Scanning Setup</DialogTitle>
            <DialogDescription>
              Configure your mail scanning preferences to receive digital copies of your mail.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-scan" className="text-sm font-medium">Auto-Scan All Mail</Label>
                <p className="text-xs text-gray-500">Automatically scan all incoming mail</p>
              </div>
              <Switch
                id="auto-scan"
                checked={scanningPreferences.autoScan}
                onCheckedChange={(checked) => 
                  setScanningPreferences(prev => ({ ...prev, autoScan: checked }))
                }
                data-testid="switch-auto-scan"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-500">Get notified when mail is scanned</p>
              </div>
              <Switch
                id="email-notifications"
                checked={scanningPreferences.emailNotifications}
                onCheckedChange={(checked) => 
                  setScanningPreferences(prev => ({ ...prev, emailNotifications: checked }))
                }
                data-testid="switch-email-notifications"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Scanning Frequency</Label>
              <Select 
                value={scanningPreferences.scanFrequency}
                onValueChange={(value) => 
                  setScanningPreferences(prev => ({ ...prev, scanFrequency: value }))
                }
              >
                <SelectTrigger data-testid="select-scan-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Current Plan</h4>
              <p className="text-sm text-gray-600">Basic Plan - 10 scans/month included</p>
              <button className="text-sm text-[#36bff9] hover:underline mt-1" data-testid="button-upgrade-plan">
                Upgrade for unlimited scanning
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMailScanningOpen(false)} data-testid="button-cancel-scanning">
              Cancel
            </Button>
            <Button 
              className="bg-[#36bff9] hover:bg-[#2aa8e0]"
              onClick={() => setMailScanningOpen(false)}
              data-testid="button-save-scanning"
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
