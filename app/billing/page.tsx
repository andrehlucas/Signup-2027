'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Download, Plus, Trash2, Check, AlertCircle, FileText, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useSubscription } from '@/app/contexts/SubscriptionContext';
import { useAddons } from '@/app/contexts/AddonsContext';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

const initialPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: '2', type: 'mastercard', last4: '8888', expiry: '03/26', isDefault: false },
];

const invoices: Invoice[] = [
  { id: 'INV-001', date: '2026-02-01', amount: 99.00, status: 'paid', description: 'Monthly Subscription - February 2026' },
  { id: 'INV-002', date: '2026-01-01', amount: 99.00, status: 'paid', description: 'Monthly Subscription - January 2026' },
  { id: 'INV-003', date: '2025-12-01', amount: 99.00, status: 'paid', description: 'Monthly Subscription - December 2025' },
  { id: 'INV-004', date: '2025-11-01', amount: 99.00, status: 'paid', description: 'Monthly Subscription - November 2025' },
  { id: 'INV-005', date: '2025-10-15', amount: 30.00, status: 'paid', description: 'Company Name Change Fee' },
];

function getCardIcon(type: PaymentMethod['type']) {
  switch (type) {
    case 'visa':
      return <div className="w-10 h-6 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>;
    case 'mastercard':
      return <div className="w-10 h-6 bg-orange-500 rounded text-white text-[8px] font-bold flex items-center justify-center">MC</div>;
    case 'amex':
      return <div className="w-10 h-6 bg-blue-400 rounded text-white text-[8px] font-bold flex items-center justify-center">AMEX</div>;
  }
}

export default function BillingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentPlanName, basePlanAmount, addonsCost, monthlyAmount } = useSubscription();
  const { activeAddons } = useAddons();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [deleteCardOpen, setDeleteCardOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<PaymentMethod | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardError, setCardError] = useState('');

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : '';
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleAddCard = () => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 15) {
      setCardError('Please enter a valid card number');
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError('Please enter a valid expiry date');
      return;
    }
    if (cardCvc.length < 3) {
      setCardError('Please enter a valid CVC');
      return;
    }
    if (!cardName.trim()) {
      setCardError('Please enter the cardholder name');
      return;
    }

    const cardType = cleanNumber.startsWith('4') ? 'visa' : cleanNumber.startsWith('5') ? 'mastercard' : 'amex';
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: cardType,
      last4: cleanNumber.slice(-4),
      expiry: cardExpiry,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newCard]);
    setAddCardOpen(false);
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCardName('');
    setCardError('');

    toast({
      title: 'Card Added',
      description: `Card ending in ${newCard.last4} has been added to your account.`,
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === id,
    })));
    toast({
      title: 'Default Card Updated',
      description: 'Your default payment method has been updated.',
    });
  };

  const handleDeleteCard = () => {
    if (!cardToDelete) return;
    
    if (cardToDelete.isDefault && paymentMethods.length > 1) {
      const remaining = paymentMethods.filter(c => c.id !== cardToDelete.id);
      remaining[0].isDefault = true;
      setPaymentMethods(remaining);
    } else {
      setPaymentMethods(paymentMethods.filter(c => c.id !== cardToDelete.id));
    }
    
    setDeleteCardOpen(false);
    setCardToDelete(null);
    toast({
      title: 'Card Removed',
      description: 'The payment method has been removed from your account.',
    });
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: 'Download Started',
      description: `Downloading invoice ${invoice.id}...`,
    });
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
    }
  };

  const nextBillingDate = 'March 1, 2026';

  return (
    <div className="p-4 lg:p-8" data-testid="billing-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-billing">
        Billing
      </h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-subscription">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            Current Subscription
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-lg font-medium text-gray-900" data-testid="text-current-plan">{currentPlanName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Total</p>
              <p className="text-lg font-medium text-gray-900" data-testid="text-monthly-amount">${monthlyAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Billing Date</p>
              <p className="text-lg font-medium text-gray-900" data-testid="text-next-billing">{nextBillingDate}</p>
            </div>
          </div>
          
          {/* Billing Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4" data-testid="billing-breakdown">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Monthly Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{currentPlanName} (Base Plan)</span>
                <span className="text-gray-900">${basePlanAmount.toFixed(2)}</span>
              </div>
              
              {activeAddons.filter(a => a.status === 'active').length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <p className="text-xs text-gray-500 mb-2">Active Add-ons</p>
                    {activeAddons
                      .filter(a => a.status === 'active')
                      .map(addon => (
                        <div key={addon.id} className="flex justify-between text-sm py-1" data-testid={`addon-line-${addon.id}`}>
                          <span className="text-gray-600">{addon.name}</span>
                          <span className="text-gray-900">${addon.price.toFixed(2)}</span>
                        </div>
                      ))
                    }
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Add-ons Subtotal</span>
                    <span>${addonsCost.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Monthly Total</span>
                  <span className="text-gray-900">${monthlyAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => router.push('/billing/plans')}
              data-testid="button-change-plan"
            >
              Change Plan
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/phone?tab=addons')}
              data-testid="button-manage-addons"
            >
              Manage Add-ons
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-payment-methods">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              Payment Methods
            </h2>
            <Button
              onClick={() => setAddCardOpen(true)}
              className="bg-[#36bff9] hover:bg-[#2aa8e0]"
              data-testid="button-add-card"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No payment methods on file</p>
              <p className="text-sm">Add a card to continue using our services</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  data-testid={`card-item-${card.id}`}
                >
                  <div className="flex items-center gap-4">
                    {getCardIcon(card.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          •••• •••• •••• {card.last4}
                        </span>
                        {card.isDefault && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!card.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(card.id)}
                        data-testid={`button-set-default-${card.id}`}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setCardToDelete(card);
                        setDeleteCardOpen(true);
                      }}
                      data-testid={`button-delete-card-${card.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-invoices">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            Billing History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Invoice</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-50" data-testid={`invoice-row-${invoice.id}`}>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">{invoice.description}</td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">${invoice.amount.toFixed(2)}</td>
                    <td className="py-3 px-2">{getStatusBadge(invoice.status)}</td>
                    <td className="py-3 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                        data-testid={`button-download-${invoice.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
        <DialogContent className="sm:max-w-md" data-testid="modal-add-card">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card to your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Smith"
                className="mt-1"
                data-testid="input-card-name"
              />
            </div>

            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                className="mt-1"
                maxLength={19}
                data-testid="input-card-number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input
                  id="card-expiry"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="mt-1"
                  maxLength={5}
                  data-testid="input-card-expiry"
                />
              </div>
              <div>
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  id="card-cvc"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="mt-1"
                  maxLength={4}
                  data-testid="input-card-cvc"
                />
              </div>
            </div>

            {cardError && (
              <p className="text-sm text-red-500 flex items-center gap-1" data-testid="text-card-error">
                <AlertCircle className="h-4 w-4" />
                {cardError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCardOpen(false)} data-testid="button-cancel-add-card">
              Cancel
            </Button>
            <Button
              onClick={handleAddCard}
              className="bg-[#36bff9] hover:bg-[#2aa8e0]"
              data-testid="button-save-card"
            >
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteCardOpen} onOpenChange={setDeleteCardOpen}>
        <DialogContent className="sm:max-w-md" data-testid="modal-delete-card">
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this card from your account?
            </DialogDescription>
          </DialogHeader>

          {cardToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {getCardIcon(cardToDelete.type)}
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• {cardToDelete.last4}</p>
                  <p className="text-sm text-gray-500">Expires {cardToDelete.expiry}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCardOpen(false)} data-testid="button-cancel-delete-card">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCard}
              data-testid="button-confirm-delete-card"
            >
              Remove Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
