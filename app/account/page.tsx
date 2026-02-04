'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Lock, Building2, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { useToast } from '@/app/hooks/use-toast';

interface PasswordValidation {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
  symbol: boolean;
}

function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

function isPasswordValid(validation: PasswordValidation): boolean {
  return validation.minLength && validation.uppercase && validation.number && validation.symbol;
}

export default function AccountPage() {
  const { toast } = useToast();

  const [currentEmail, setCurrentEmail] = useState('john.smith@acmecorp.com');
  const [currentPhone, setCurrentPhone] = useState('(305) 555-1234');
  const [companyName, setCompanyName] = useState('Acme Corporation');

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailStep, setEmailStep] = useState<'enter' | 'verify' | 'success'>('enter');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const [passwordError, setPasswordError] = useState('');

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [newCompanyName, setNewCompanyName] = useState('');
  const [feeAccepted, setFeeAccepted] = useState(false);
  const [companyConfirmOpen, setCompanyConfirmOpen] = useState(false);
  const [companyError, setCompanyError] = useState('');

  useEffect(() => {
    setPasswordValidation(validatePassword(newPassword));
  }, [newPassword]);

  const canUpdatePassword = 
    currentPassword.length > 0 &&
    isPasswordValid(passwordValidation) &&
    newPassword === confirmPassword &&
    newPassword.length > 0;

  const handleChangeEmail = () => {
    setEmailStep('enter');
    setNewEmail('');
    setEmailPassword('');
    setEmailError('');
    setEmailModalOpen(true);
  };

  const handleEmailSubmit = () => {
    if (!newEmail.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (emailPassword.length < 1) {
      setEmailError('Please enter your current password');
      return;
    }
    setEmailError('');
    setEmailStep('verify');
  };

  const handleEmailVerified = () => {
    setEmailStep('success');
    setCurrentEmail(newEmail);
  };

  const handleEmailModalClose = () => {
    setEmailModalOpen(false);
    if (emailStep === 'success') {
      toast({
        title: 'Email Updated',
        description: 'Your login email has been updated successfully.',
      });
    }
  };

  const handleUpdatePassword = () => {
    if (!canUpdatePassword) return;

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    setPasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast({
      title: 'Password Updated',
      description: 'Your password has been updated successfully.',
    });
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setNewPhone(formatted);
  };

  const handleChangePhone = () => {
    const numbers = newPhone.replace(/\D/g, '');
    if (numbers.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    setPhoneError('');
    setCurrentPhone(newPhone);
    setIsEditingPhone(false);
    setNewPhone('');
    toast({
      title: 'Phone Updated',
      description: 'Your contact phone number has been updated successfully.',
    });
  };

  const handleCompanySubmit = () => {
    if (!newCompanyName.trim()) {
      setCompanyError('Company name cannot be empty');
      return;
    }
    if (!feeAccepted) {
      setCompanyError('You must accept the $30 fee to proceed');
      return;
    }
    setCompanyError('');
    setCompanyConfirmOpen(true);
  };

  const handleCompanyConfirm = () => {
    setCompanyName(newCompanyName);
    setCompanyConfirmOpen(false);
    setNewCompanyName('');
    setFeeAccepted(false);
    toast({
      title: 'Request Submitted',
      description: 'Your company name change request has been submitted. Processing time is typically 1-2 business days.',
    });
  };

  return (
    <div className="p-4 lg:p-8" data-testid="account-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-account">
        Account Settings
      </h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-account-settings">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-500" />
            Login & Security
          </h2>

          <div className="space-y-6">
            <div className="pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">My Current Login E-Mail</Label>
                  <p className="text-gray-900 mt-1" data-testid="text-current-email">{currentEmail}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleChangeEmail}
                  data-testid="button-change-email"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Change Email
                </Button>
              </div>
            </div>

            <div className="pb-6 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="mt-1"
                    data-testid="input-current-password"
                  />
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10"
                      data-testid="input-new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      data-testid="button-toggle-new-password"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {newPassword.length > 0 && (
                    <div className="mt-2 space-y-1" data-testid="password-validation-checklist">
                      <div className={`flex items-center gap-2 text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        1 uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        1 number
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${passwordValidation.symbol ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.symbol ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        1 symbol (!@#$%^&* etc.)
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pr-10"
                      data-testid="input-confirm-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      data-testid="button-toggle-confirm-password"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1" data-testid="text-password-mismatch">
                      Passwords don't match
                    </p>
                  )}
                </div>

                {passwordError && (
                  <p className="text-sm text-red-500 flex items-center gap-1" data-testid="text-password-error">
                    <AlertCircle className="h-4 w-4" />
                    {passwordError}
                  </p>
                )}

                <Button
                  onClick={handleUpdatePassword}
                  disabled={!canUpdatePassword}
                  className="bg-[#36bff9] hover:bg-[#2aa8e0] disabled:opacity-50"
                  data-testid="button-update-password"
                >
                  Update Password
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Current Contact Phone</Label>
                  <p className="text-gray-900 mt-1" data-testid="text-current-phone">{currentPhone}</p>
                </div>
                {!isEditingPhone && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingPhone(true)}
                    data-testid="button-edit-phone"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Edit Phone
                  </Button>
                )}
              </div>

              {isEditingPhone && (
                <div className="mt-4 max-w-md space-y-3">
                  <div>
                    <Label htmlFor="new-phone">Enter your new phone number</Label>
                    <Input
                      id="new-phone"
                      type="tel"
                      value={newPhone}
                      onChange={handlePhoneChange}
                      placeholder="(555) 555-5555"
                      className="mt-1"
                      data-testid="input-new-phone"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: (555) 555-5555</p>
                  </div>
                  {phoneError && (
                    <p className="text-sm text-red-500 flex items-center gap-1" data-testid="text-phone-error">
                      <AlertCircle className="h-4 w-4" />
                      {phoneError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingPhone(false);
                        setNewPhone('');
                        setPhoneError('');
                      }}
                      data-testid="button-cancel-phone"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePhone}
                      className="bg-[#36bff9] hover:bg-[#2aa8e0]"
                      data-testid="button-change-phone"
                    >
                      Change Phone
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-company-details">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            Manage/Update Company Details
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            <span className="text-red-500">*</span> To update your business name, please submit a name change request below.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Fee Notice:</strong> A one-time fee of $30 will apply for the company name update. This covers administrative verification, billing records update, and receptionist script changes.
            </p>
          </div>

          <div className="max-w-md space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Current Company Name</Label>
              <p className="text-gray-900 mt-1 font-medium" data-testid="text-current-company">{companyName}</p>
            </div>

            <div>
              <Label htmlFor="new-company-name">Enter your new company name</Label>
              <Input
                id="new-company-name"
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="New company name"
                className="mt-1"
                data-testid="input-new-company-name"
              />
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="fee-accepted"
                checked={feeAccepted}
                onCheckedChange={(checked) => setFeeAccepted(checked as boolean)}
                data-testid="checkbox-fee-accepted"
              />
              <Label
                htmlFor="fee-accepted"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I understand there is a $30 one-time fee for this name change request.
              </Label>
            </div>

            {companyError && (
              <p className="text-sm text-red-500 flex items-center gap-1" data-testid="text-company-error">
                <AlertCircle className="h-4 w-4" />
                {companyError}
              </p>
            )}

            <Button
              onClick={handleCompanySubmit}
              className="bg-[#36bff9] hover:bg-[#2aa8e0]"
              data-testid="button-submit-company"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={emailModalOpen} onOpenChange={handleEmailModalClose}>
        <DialogContent className="sm:max-w-md" data-testid="modal-change-email">
          <DialogHeader>
            <DialogTitle>
              {emailStep === 'enter' && 'Change Email Address'}
              {emailStep === 'verify' && 'Verify Your Email'}
              {emailStep === 'success' && 'Email Updated'}
            </DialogTitle>
            <DialogDescription>
              {emailStep === 'enter' && 'Enter your new email address and confirm with your password.'}
              {emailStep === 'verify' && `We've sent a verification link to ${newEmail}. Please check your inbox.`}
              {emailStep === 'success' && 'Your email address has been successfully updated.'}
            </DialogDescription>
          </DialogHeader>

          {emailStep === 'enter' && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="new-email">New Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="mt-1"
                  data-testid="input-new-email"
                />
              </div>
              <div>
                <Label htmlFor="email-password">Confirm Your Password</Label>
                <Input
                  id="email-password"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1"
                  data-testid="input-email-password"
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-500 flex items-center gap-1" data-testid="text-email-error">
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </p>
              )}
            </div>
          )}

          {emailStep === 'verify' && (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-[#36bff9]" />
              </div>
              <p className="text-sm text-gray-600">
                Click the verification link in the email we sent to complete the process.
              </p>
              <Button
                variant="link"
                className="text-[#36bff9] mt-2"
                onClick={handleEmailVerified}
                data-testid="button-simulate-verify"
              >
                (Simulate: I've verified)
              </Button>
            </div>
          )}

          {emailStep === 'success' && (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-900 font-medium">Your new email is now active:</p>
              <p className="text-[#36bff9]" data-testid="text-new-email">{currentEmail}</p>
            </div>
          )}

          <DialogFooter>
            {emailStep === 'enter' && (
              <>
                <Button variant="outline" onClick={() => setEmailModalOpen(false)} data-testid="button-cancel-email">
                  Cancel
                </Button>
                <Button
                  onClick={handleEmailSubmit}
                  className="bg-[#36bff9] hover:bg-[#2aa8e0]"
                  data-testid="button-continue-email"
                >
                  Continue
                </Button>
              </>
            )}
            {emailStep === 'verify' && (
              <Button variant="outline" onClick={() => setEmailModalOpen(false)} data-testid="button-close-verify">
                Close
              </Button>
            )}
            {emailStep === 'success' && (
              <Button
                onClick={handleEmailModalClose}
                className="bg-[#36bff9] hover:bg-[#2aa8e0]"
                data-testid="button-done-email"
              >
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={companyConfirmOpen} onOpenChange={setCompanyConfirmOpen}>
        <DialogContent className="sm:max-w-md" data-testid="modal-confirm-company">
          <DialogHeader>
            <DialogTitle>Confirm Name Change Request</DialogTitle>
            <DialogDescription>
              Please confirm your company name change request.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Current Name:</span>
                <span className="font-medium">{companyName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New Name:</span>
                <span className="font-medium text-[#36bff9]">{newCompanyName}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>One-time fee:</strong> $30 will be charged to your account.
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Expected processing time: 1-2 business days. You can track the status in your account dashboard.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyConfirmOpen(false)} data-testid="button-cancel-company-confirm">
              Cancel
            </Button>
            <Button
              onClick={handleCompanyConfirm}
              className="bg-[#36bff9] hover:bg-[#2aa8e0]"
              data-testid="button-confirm-company"
            >
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
