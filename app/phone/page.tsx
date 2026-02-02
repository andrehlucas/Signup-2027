'use client';

import { useState } from 'react';
import { 
  Phone, 
  Voicemail, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

interface Extension {
  id: string;
  name: string;
  number: string;
  type: 'user' | 'department';
  voicemailEnabled: boolean;
}

const mockExtensions: Extension[] = [
  { id: '1', name: 'Main Line', number: '101', type: 'department', voicemailEnabled: true },
  { id: '2', name: 'Sales Team', number: '102', type: 'department', voicemailEnabled: true },
  { id: '3', name: 'John Smith', number: '103', type: 'user', voicemailEnabled: true },
  { id: '4', name: 'Jane Doe', number: '104', type: 'user', voicemailEnabled: false },
];

const mockFaxes = [
  { id: '1', from: '+1 (555) 123-4567', date: '2026-02-01', pages: 3, status: 'received' },
  { id: '2', from: '+1 (555) 987-6543', date: '2026-01-30', pages: 1, status: 'received' },
  { id: '3', to: '+1 (555) 456-7890', date: '2026-01-28', pages: 5, status: 'sent' },
];

const mockTexts = [
  { id: '1', contact: '+1 (555) 123-4567', message: 'Thank you for your inquiry...', date: '2026-02-01', direction: 'inbound' },
  { id: '2', contact: '+1 (555) 987-6543', message: 'Your appointment is confirmed...', date: '2026-02-01', direction: 'outbound' },
];

const mockConferences = [
  { id: '1', name: 'Weekly Team Call', pin: '1234', participants: 8, scheduled: '2026-02-05 10:00 AM' },
  { id: '2', name: 'Client Meeting', pin: '5678', participants: 4, scheduled: '2026-02-06 2:00 PM' },
];

const mockCallLogs = [
  { id: '1', number: '+1 (555) 123-4567', type: 'inbound', duration: '5:23', date: '2026-02-02 9:30 AM', status: 'answered' },
  { id: '2', number: '+1 (555) 987-6543', type: 'outbound', duration: '2:15', date: '2026-02-02 10:15 AM', status: 'answered' },
  { id: '3', number: '+1 (555) 456-7890', type: 'inbound', duration: '0:00', date: '2026-02-02 11:00 AM', status: 'missed' },
];

function ExtensionsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Extensions & Voicemail</h2>
          <p className="text-sm text-gray-500">Manage your phone extensions and voicemail settings</p>
        </div>
        <Button className="bg-[#36bff9] hover:bg-[#2aa8e0]" data-testid="button-add-extension">
          <Plus className="h-4 w-4 mr-2" />
          Add Extension
        </Button>
      </div>

      <div className="grid gap-4">
        {mockExtensions.map((ext) => (
          <Card key={ext.id} className="p-4" data-testid={`extension-card-${ext.id}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e0f7fa] flex items-center justify-center">
                  {ext.type === 'department' ? (
                    <Users className="h-5 w-5 text-[#36bff9]" />
                  ) : (
                    <Phone className="h-5 w-5 text-[#36bff9]" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ext.name}</p>
                  <p className="text-sm text-gray-500">Ext. {ext.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Voicemail className={`h-4 w-4 ${ext.voicemailEnabled ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-sm text-gray-500">
                    {ext.voicemailEnabled ? 'Voicemail On' : 'Voicemail Off'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" data-testid={`button-edit-ext-${ext.id}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" data-testid={`button-delete-ext-${ext.id}`}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FaxServicesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Fax Services</h2>
          <p className="text-sm text-gray-500">Send and receive faxes digitally</p>
        </div>
        <Button className="bg-[#36bff9] hover:bg-[#2aa8e0]" data-testid="button-send-fax">
          <Plus className="h-4 w-4 mr-2" />
          Send New Fax
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <p className="text-sm font-medium text-gray-700">Your Fax Number: <span className="text-[#36bff9]">+1 (555) 000-1234</span></p>
        </div>
        <div className="divide-y">
          {mockFaxes.map((fax) => (
            <div key={fax.id} className="p-4 flex items-center justify-between" data-testid={`fax-row-${fax.id}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${fax.status === 'received' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <FileText className={`h-5 w-5 ${fax.status === 'received' ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{fax.status === 'received' ? `From: ${fax.from}` : `To: ${fax.to}`}</p>
                  <p className="text-sm text-gray-500">{fax.pages} pages · {fax.date}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid={`button-view-fax-${fax.id}`}>View</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TextingTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Texting</h2>
          <p className="text-sm text-gray-500">Send and receive business text messages</p>
        </div>
        <Button className="bg-[#36bff9] hover:bg-[#2aa8e0]" data-testid="button-new-message">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="bg-white rounded-lg border divide-y">
        {mockTexts.map((text) => (
          <div key={text.id} className="p-4 flex items-start gap-4" data-testid={`text-row-${text.id}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${text.direction === 'inbound' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <MessageSquare className={`h-5 w-5 ${text.direction === 'inbound' ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">{text.contact}</p>
                <span className="text-xs text-gray-500">{text.date}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{text.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConferenceCallsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Conference Calls</h2>
          <p className="text-sm text-gray-500">Schedule and manage conference calls</p>
        </div>
        <Button className="bg-[#36bff9] hover:bg-[#2aa8e0]" data-testid="button-new-conference">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Conference
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockConferences.map((conf) => (
          <Card key={conf.id} className="p-4" data-testid={`conference-card-${conf.id}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{conf.name}</p>
                  <p className="text-sm text-gray-500">PIN: {conf.pin}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{conf.participants} participants</span>
              <span className="text-[#36bff9]">{conf.scheduled}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" data-testid={`button-join-conf-${conf.id}`}>Join Now</Button>
              <Button variant="ghost" size="sm" data-testid={`button-edit-conf-${conf.id}`}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CallLogsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Call Logs & Settings</h2>
        <p className="text-sm text-gray-500">View call history and manage phone settings</p>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">Recent Calls</h3>
        </div>
        <div className="divide-y">
          {mockCallLogs.map((call) => (
            <div key={call.id} className="p-4 flex items-center justify-between" data-testid={`call-log-${call.id}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  call.status === 'missed' ? 'bg-red-100' : 
                  call.type === 'inbound' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {call.status === 'missed' ? (
                    <PhoneMissed className="h-5 w-5 text-red-600" />
                  ) : call.type === 'inbound' ? (
                    <PhoneCall className="h-5 w-5 text-green-600" />
                  ) : (
                    <PhoneForwarded className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{call.number}</p>
                  <p className="text-sm text-gray-500">{call.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${call.status === 'missed' ? 'text-red-600' : 'text-gray-900'}`}>
                  {call.status === 'missed' ? 'Missed' : call.duration}
                </p>
                <p className="text-xs text-gray-500 capitalize">{call.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Phone Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium text-gray-900">Call Forwarding</p>
              <p className="text-sm text-gray-500">Forward calls to another number</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-call-forwarding">Configure</Button>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium text-gray-900">Business Hours</p>
              <p className="text-sm text-gray-500">Set your available hours</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-business-hours">Configure</Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Auto-Attendant</p>
              <p className="text-sm text-gray-500">Configure automated greetings</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-auto-attendant">Configure</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function PhoneSystemPage() {
  const [activeTab, setActiveTab] = useState('extensions');

  return (
    <div className="p-4 lg:p-8" data-testid="phone-system-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-phone-system">
        Phone System
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-gray-100 p-1 rounded-lg mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger 
            value="extensions" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#36bff9] px-4 py-2"
            data-testid="tab-extensions"
          >
            <Phone className="h-4 w-4 mr-2" />
            Extensions & Voicemail
          </TabsTrigger>
          <TabsTrigger 
            value="fax" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#36bff9] px-4 py-2"
            data-testid="tab-fax"
          >
            <FileText className="h-4 w-4 mr-2" />
            Fax Services
          </TabsTrigger>
          <TabsTrigger 
            value="texting" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#36bff9] px-4 py-2"
            data-testid="tab-texting"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Texting
          </TabsTrigger>
          <TabsTrigger 
            value="conference" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#36bff9] px-4 py-2"
            data-testid="tab-conference"
          >
            <Users className="h-4 w-4 mr-2" />
            Conference Calls
          </TabsTrigger>
          <TabsTrigger 
            value="logs" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#36bff9] px-4 py-2"
            data-testid="tab-logs"
          >
            <Settings className="h-4 w-4 mr-2" />
            Call Logs & Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="extensions">
          <ExtensionsTab />
        </TabsContent>
        <TabsContent value="fax">
          <FaxServicesTab />
        </TabsContent>
        <TabsContent value="texting">
          <TextingTab />
        </TabsContent>
        <TabsContent value="conference">
          <ConferenceCallsTab />
        </TabsContent>
        <TabsContent value="logs">
          <CallLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
