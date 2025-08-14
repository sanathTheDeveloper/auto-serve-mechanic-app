"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Building2,
  DollarSign,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Banknote,
  Wallet,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'digital' | 'crypto';
  icon: React.ReactNode;
  description: string;
  processingTime: string;
  fees: string;
  enabled: boolean;
}

interface PaymentSetupProps {
  initialData?: {
    abn: string;
    businessName: string;
    businessType: string;
    bankAccount: string;
    paymentMethods: string[];
    taxSettings: {
      gstRegistered: boolean;
      gstNumber?: string;
      taxRate: number;
    };
  };
  onDataChange: (data: Record<string, unknown>) => void;
}

export function PaymentSetup({ initialData, onDataChange }: PaymentSetupProps) {
  const [formData, setFormData] = useState({
    abn: initialData?.abn || '',
    businessName: initialData?.businessName || '',
    businessType: initialData?.businessType || 'sole-trader',
    bankAccount: initialData?.bankAccount || '',
    bsb: '',
    accountNumber: '',
    accountName: '',
    paymentMethods: initialData?.paymentMethods || ['bank-transfer'],
    taxSettings: {
      gstRegistered: initialData?.taxSettings?.gstRegistered || false,
      gstNumber: initialData?.taxSettings?.gstNumber || '',
      taxRate: initialData?.taxSettings?.taxRate || 10
    }
  });

  const [showAccountDetails, setShowAccountDetails] = useState(false);
  // const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'methods' | 'tax'>('basic');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'bank',
      icon: <Banknote className="h-5 w-5" />,
      description: 'Direct bank account transfers (recommended)',
      processingTime: '1-3 business days',
      fees: 'No fees',
      enabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'digital',
      icon: <Wallet className="h-5 w-5" />,
      description: 'PayPal payments',
      processingTime: 'Instant',
      fees: '2.9% + $0.30',
      enabled: false
    },
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'digital',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Credit/debit card payments',
      processingTime: '2-7 business days',
      fees: '2.9% + $0.30',
      enabled: false
    }
  ];

  const businessTypes = [
    { id: 'sole-trader', name: 'Sole Trader', description: 'Individual business owner' },
    { id: 'partnership', name: 'Partnership', description: 'Business owned by partners' },
    { id: 'company', name: 'Company (Pty Ltd)', description: 'Incorporated company' },
    { id: 'trust', name: 'Trust', description: 'Trust structure' }
  ];

  const updateFormData = (field: keyof typeof formData, value: unknown) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const updateNestedFormData = (path: string[], value: unknown) => {
    const newData = { ...formData };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    setFormData(newData);
    onDataChange(newData);
  };

  const togglePaymentMethod = (methodId: string) => {
    const currentMethods = formData.paymentMethods;
    const newMethods = currentMethods.includes(methodId)
      ? currentMethods.filter(id => id !== methodId)
      : [...currentMethods, methodId];
    
    updateFormData('paymentMethods', newMethods);
  };

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text);
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  // };

  const formatABN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4').trim();
    }
    return value;
  };

  const validateABN = (abn: string) => {
    const numbers = abn.replace(/\s/g, '');
    return numbers.length === 11 && /^\d+$/.test(numbers);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white/90 backdrop-blur-sm rounded-t-xl">
        {[
          { id: 'basic', label: 'Business Details', icon: Building2 },
          { id: 'methods', label: 'Payment Methods', icon: CreditCard },
          { id: 'tax', label: 'Tax Settings', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Business Details */}
      {activeTab === 'basic' && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <Building2 className="h-5 w-5 text-blue-500" />
              Business Information
            </CardTitle>
            <p className="text-slate-600">
              Essential business details for payment processing and compliance
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Business Structure *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {businessTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateFormData('businessType', type.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.businessType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{type.name}</div>
                    <div className="text-xs text-slate-600 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ABN Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Australian Business Number (ABN) *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="12 345 678 901"
                  value={formData.abn}
                  onChange={(e) => updateFormData('abn', formatABN(e.target.value))}
                  className={`pl-10 ${
                    formData.abn && !validateABN(formData.abn)
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }`}
                  maxLength={13}
                />
                {formData.abn && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validateABN(formData.abn) ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {formData.abn && !validateABN(formData.abn) && (
                <p className="text-xs text-red-600 mt-1">
                  Please enter a valid 11-digit ABN
                </p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Registered Business Name *
              </label>
              <Input
                placeholder="Your Auto Service Pty Ltd"
                value={formData.businessName}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Bank Account Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-slate-800">Bank Account Details</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAccountDetails(!showAccountDetails)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {showAccountDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showAccountDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    BSB *
                  </label>
                  <Input
                    placeholder="083-004"
                    value={formData.bsb}
                    onChange={(e) => {
                      const formatted = e.target.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})/, '$1-$2');
                      updateFormData('bsb', formatted);
                    }}
                    className="font-mono"
                    maxLength={7}
                    type={showAccountDetails ? 'text' : 'password'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Number *
                  </label>
                  <Input
                    placeholder="12345678"
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const numbers = e.target.value.replace(/\D/g, '');
                      updateFormData('accountNumber', numbers);
                    }}
                    className="font-mono"
                    maxLength={10}
                    type={showAccountDetails ? 'text' : 'password'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Name *
                </label>
                <Input
                  placeholder="Your Auto Service Pty Ltd"
                  value={formData.accountName}
                  onChange={(e) => updateFormData('accountName', e.target.value)}
                  type={showAccountDetails ? 'text' : 'password'}
                />
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-800 mb-1">Secure Payment Processing</p>
                  <p className="text-blue-700">
                    Your bank details are encrypted and securely stored. We only use this information 
                    to process payments for completed services.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      {activeTab === 'methods' && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <CreditCard className="h-5 w-5 text-blue-500" />
              Payment Methods
            </CardTitle>
            <p className="text-slate-600">
              Choose how you&apos;d like to receive payments from customers
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {paymentMethods.map(method => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all border-2 ${
                    formData.paymentMethods.includes(method.id)
                      ? 'border-blue-500 bg-blue-50/50 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                  onClick={() => togglePaymentMethod(method.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          formData.paymentMethods.includes(method.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-800">{method.name}</h4>
                            {method.id === 'bank-transfer' && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{method.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-500">Processing Time:</span>
                              <div className="font-medium text-slate-700">{method.processingTime}</div>
                            </div>
                            <div>
                              <span className="text-slate-500">Fees:</span>
                              <div className="font-medium text-slate-700">{method.fees}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {formData.paymentMethods.includes(method.id) ? (
                          <CheckCircle className="h-6 w-6 text-blue-500" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-slate-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Commission Information */}
            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Platform Commission</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Auto Serve charges a standard 15% commission on all completed bookings. 
                    This covers platform maintenance, customer support, and payment processing.
                  </p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      15% commission rate (industry standard)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Settings */}
      {activeTab === 'tax' && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Tax Settings
            </CardTitle>
            <p className="text-slate-600">
              Configure GST and tax settings for your business
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* GST Registration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-800">GST Registered Business</h4>
                  <p className="text-sm text-slate-600">
                    Are you registered for Goods and Services Tax (GST)?
                  </p>
                </div>
                <button
                  onClick={() => updateNestedFormData(['taxSettings', 'gstRegistered'], !formData.taxSettings.gstRegistered)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.taxSettings.gstRegistered ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.taxSettings.gstRegistered ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {formData.taxSettings.gstRegistered && (
                <div className="space-y-4 p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      GST Number *
                    </label>
                    <Input
                      placeholder="12 345 678 901"
                      value={formData.taxSettings.gstNumber}
                      onChange={(e) => updateNestedFormData(['taxSettings', 'gstNumber'], e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Usually the same as your ABN
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      GST Rate (%)
                    </label>
                    <div className="relative w-32">
                      <Input
                        type="number"
                        value={formData.taxSettings.taxRate}
                        onChange={(e) => updateNestedFormData(['taxSettings', 'taxRate'], Number(e.target.value))}
                        className="pr-8"
                        min="0"
                        max="20"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tax Information */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-semibold text-slate-800 mb-3">Tax Compliance Information</h4>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>All invoices will automatically include applicable taxes</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>Tax calculations are handled automatically based on your settings</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>You can update these settings anytime in your dashboard</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}