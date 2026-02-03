'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, MailAction, MailSettings } from '../../shared/schema';
import { Button } from '@/app/components/ui/button';
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
import { 
  ScanLine, 
  Forward, 
  Hand, 
  Trash2, 
  X,
  Mail as MailIcon,
  RefreshCw
} from 'lucide-react';

const actionLabels: Record<MailAction, string> = {
  scan: 'Scan',
  forward: 'Forward',
  keep: 'Keep',
  shred: 'Shred',
  not_my_mail: 'Not My Mail',
};

const defaultActionLabels: Record<string, string> = {
  scan: 'Scan My Mail',
  forward: 'Forward My Mail',
  keep: 'Keep My Mail',
  shred: 'Shred My Mail',
};

export function MyMailSection() {
  const queryClient = useQueryClient();
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<MailAction | null>(null);
  const [editingDefaultAction, setEditingDefaultAction] = useState(false);

  const { data: mailItems = [], isLoading: mailLoading } = useQuery<Mail[]>({
    queryKey: ['/api/mail'],
    queryFn: async () => {
      const res = await fetch('/api/mail');
      if (!res.ok) throw new Error('Failed to fetch mail');
      return res.json();
    },
  });

  const { data: mailSettings } = useQuery<MailSettings>({
    queryKey: ['/api/mail-settings'],
    queryFn: async () => {
      const res = await fetch('/api/mail-settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: MailAction }) => {
      const response = await fetch(`/api/mail/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error('Failed to update mail');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mail'] });
      setConfirmModalOpen(false);
      setReviewModalOpen(false);
      setSelectedMail(null);
      setPendingAction(null);
    },
  });

  const settingsMutation = useMutation({
    mutationFn: async (defaultAction: string) => {
      const response = await fetch('/api/mail-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultAction }),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mail-settings'] });
      setEditingDefaultAction(false);
    },
  });

  const handleReview = (mail: Mail) => {
    setSelectedMail(mail);
    setReviewModalOpen(true);
  };

  const handleAction = (action: MailAction) => {
    setPendingAction(action);
    setConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedMail && pendingAction) {
      actionMutation.mutate({ id: selectedMail.id, action: pendingAction });
    }
  };

  const currentDefaultAction = mailSettings?.defaultAction || 'keep';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6" data-testid="my-mail-section">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900" data-testid="heading-my-mail">My Mail</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            powered by 
            <span className="font-semibold text-[#3b82f6]">mail<span className="text-[#1d4ed8]">X</span></span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Current default action for new mail:</span>
          {editingDefaultAction ? (
            <div className="flex items-center gap-2">
              <Select
                value={currentDefaultAction}
                onValueChange={(value) => settingsMutation.mutate(value)}
              >
                <SelectTrigger className="w-[180px]" data-testid="select-default-action">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keep">Keep My Mail</SelectItem>
                  <SelectItem value="scan">Scan My Mail</SelectItem>
                  <SelectItem value="forward">Forward My Mail</SelectItem>
                  <SelectItem value="shred">Shred My Mail</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => setEditingDefaultAction(false)}
                className="text-gray-500 hover:text-gray-700"
                data-testid="button-cancel-edit-default"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 flex items-center gap-1" data-testid="text-default-action">
                <RefreshCw className="h-3 w-3" />
                {defaultActionLabels[currentDefaultAction] || 'Keep My Mail'}
              </span>
              <button
                onClick={() => setEditingDefaultAction(true)}
                className="text-gray-600 hover:text-[#36bff9] font-medium"
                data-testid="button-edit-default-action"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium text-gray-900 mb-1" data-testid="heading-new-mail">New Mail</h3>
        <p className="text-sm text-gray-500">Please review and take appropriate action.</p>
      </div>

      {mailLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-10 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      ) : mailItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500" data-testid="text-no-mail">
          <MailIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No pending mail items</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mailItems.map((mail) => (
            <div
              key={mail.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              data-testid={`mail-item-${mail.id}`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <MailIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900" data-testid={`text-mail-name-${mail.id}`}>{mail.name}</p>
                <p className="text-sm text-gray-500" data-testid={`text-mail-date-${mail.id}`}>{mail.receivedDate}</p>
              </div>
              <Button
                className="bg-[#3b5998] hover:bg-[#344e86] text-white"
                onClick={() => handleReview(mail)}
                data-testid={`button-review-${mail.id}`}
              >
                Review
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-lg" data-testid="mail-review-modal">
          <DialogHeader className="sr-only">
            <DialogTitle>Review Mail</DialogTitle>
          </DialogHeader>
          
          {selectedMail && (
            <div className="flex flex-col items-center">
              <div 
                className="w-full max-w-sm rounded-lg overflow-hidden mb-6 relative"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
                  padding: '16px'
                }}
              >
                <div 
                  className="bg-[#f5f5dc] rounded-sm p-4 relative"
                  style={{
                    borderImage: 'repeating-linear-gradient(45deg, #36bff9, #36bff9 10px, #dc2626 10px, #dc2626 20px) 8',
                    borderWidth: '8px',
                    borderStyle: 'solid'
                  }}
                >
                  <div className="absolute top-2 right-2 w-12 h-14 bg-[#36bff9] rounded-sm flex items-center justify-center">
                    <div className="text-white text-xs font-bold">1st</div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-4">
                    <p className="font-medium">{selectedMail.senderName}</p>
                    <p>{selectedMail.senderAddress}</p>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="font-bold text-gray-900">{selectedMail.recipientName}</p>
                    <p className="text-sm text-gray-700">{selectedMail.recipientAddress}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1" data-testid="text-selected-mail-name">
                {selectedMail.name}
              </h3>
              <p className="text-gray-500 mb-6" data-testid="text-selected-mail-date">
                {selectedMail.receivedDate}
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  className="h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={() => handleAction('scan')}
                  data-testid="button-action-scan"
                >
                  <ScanLine className="h-5 w-5 mr-2" />
                  Scan
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={() => handleAction('forward')}
                  data-testid="button-action-forward"
                >
                  <Forward className="h-5 w-5 mr-2" />
                  Forward
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={() => handleAction('keep')}
                  data-testid="button-action-keep"
                >
                  <Hand className="h-5 w-5 mr-2" />
                  Keep
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={() => handleAction('shred')}
                  data-testid="button-action-shred"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Shred
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full h-12 mt-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={() => handleAction('not_my_mail')}
                data-testid="button-action-not-my-mail"
              >
                <X className="h-5 w-5 mr-2" />
                Not My Mail
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-md" data-testid="mail-confirm-modal">
          <div className="text-center py-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center" data-testid="text-confirm-title">
                Are you sure you want to {pendingAction ? actionLabels[pendingAction].toLowerCase() : ''} this mail?
              </DialogTitle>
              <DialogDescription className="text-center text-gray-500 mt-2">
                This action will permanently {pendingAction ? actionLabels[pendingAction].toLowerCase() : ''} the selected mail
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => {
                  setConfirmModalOpen(false);
                  setPendingAction(null);
                }}
                disabled={actionMutation.isPending}
                data-testid="button-confirm-back"
              >
                Back
              </Button>
              <Button
                className="flex-1 h-12 bg-[#3b5998] hover:bg-[#344e86]"
                onClick={handleConfirm}
                disabled={actionMutation.isPending}
                data-testid="button-confirm-action"
              >
                {actionMutation.isPending ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
