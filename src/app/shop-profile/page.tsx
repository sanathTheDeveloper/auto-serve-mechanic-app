"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ServicePackageBuilder } from '@/components/ServicePackageBuilder';
import { ServiceMenuPreview } from '@/components/ServiceMenuPreview';
import { PaymentSetup } from '@/components/PaymentSetup';
import { BusinessHoursSetup } from '@/components/BusinessHoursSetup';
import { ServiceMenuData, DEFAULT_BASIC_PACKAGE, DEFAULT_FULL_PACKAGE, DEFAULT_EXTRA_SERVICES } from '@/lib/services';
import { validateEmail, validateAustralianPhone, validateAustralianPostcode, validateWebsiteUrl } from '@/lib/validation';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  CheckCircle,
  Wrench,
  CreditCard,
  Car,
  Eye,
  Globe,
  AlertCircle,
} from "lucide-react";

export default function ShopProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, completeProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    shopName: user?.shopName || "",
    description: "",
    email: user?.email || "",
    phone: user?.phone || "",
    website: "",
    
    // Location
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Service Setup
    basicServicePrice: "",
    fullServicePrice: "",
    tyreRotationPrice: "",
    serviceBays: "2",
    operatingHours: "8:00 AM - 6:00 PM",
    
    // Payment Info
    abn: "",
    bankAccount: "",
    commissionRate: "15"
  });

  // Service Menu Data
  const [serviceMenuData, setServiceMenuData] = useState<ServiceMenuData>({
    basicPackage: DEFAULT_BASIC_PACKAGE,
    fullPackage: DEFAULT_FULL_PACKAGE,
    extraServices: DEFAULT_EXTRA_SERVICES,
    customServices: []
  });

  const [showServicePreview, setShowServicePreview] = useState(false);

  // Payment and Business Hours Data
  const [paymentData, setPaymentData] = useState({
    abn: "",
    businessName: "",
    businessType: "sole-trader",
    bankAccount: "",
    paymentMethods: ["bank-transfer"],
    taxSettings: {
      gstRegistered: false,
      gstNumber: "",
      taxRate: 10
    }
  });

  const [businessHoursData, setBusinessHoursData] = useState({
    schedule: [],
    timezone: "Australia/Melbourne",
    lunchBreak: {
      enabled: false,
      start: "12:00",
      end: "13:00"
    },
    specialDays: []
  });

  // Real-time validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
  }, [isAuthenticated, router]);

  // Update form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        shopName: user.shopName || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: "Shop Details", icon: Building2 },
    { id: 2, title: "Service Menu", icon: Wrench },
    { id: 3, title: "Payment Setup", icon: CreditCard },
    { id: 4, title: "Business Hours", icon: Clock },
    { id: 5, title: "Launch It!!", icon: CheckCircle },
  ];

  const triggerSuccessConfetti = () => {
    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#F59E0B', '#60A5FA', '#64748B', '#10B981']
    });

    // Multiple confetti bursts
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 25,
      spread: 360, 
      ticks: 100,
      zIndex: 1000 
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 30 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) },
        colors: ['#3B82F6', '#F59E0B', '#60A5FA', '#64748B', '#10B981']
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) },
        colors: ['#3B82F6', '#F59E0B', '#60A5FA', '#64748B', '#10B981']
      });
      
      if (Math.floor(timeLeft / 1000) !== Math.floor((timeLeft - 500) / 1000)) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#3B82F6', '#F59E0B', '#60A5FA', '#64748B', '#10B981']
        });
      }
    }, 500);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#3B82F6', '#F59E0B', '#60A5FA', '#64748B', '#10B981']
      });
    }, 3500);
  };

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    triggerSuccessConfetti();
    
    // Mark profile as completed in auth system
    await completeProfile();
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Real-time validation
    validateField(field, value);
  };

  const validateField = (field: string, value: string) => {
    let validation: { isValid: boolean; message?: string } = { isValid: true };
    
    switch (field) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        validation = validateAustralianPhone(value);
        break;
      case 'zipCode':
        validation = validateAustralianPostcode(value);
        break;
      case 'website':
        validation = validateWebsiteUrl(value);
        break;
    }
    
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, [field]: validation.message || '' }));
    }
  };

  const getFieldError = (field: string) => validationErrors[field];
  const hasFieldError = (field: string) => !!validationErrors[field];

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Shop Details</h3>
              <p className="text-slate-600 mb-6">Basic information about your automotive service business</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Shop Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Melbourne Auto Care"
                    value={formData.shopName}
                    onChange={(e) => updateFormData("shopName", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Business Description</label>
                <textarea
                  placeholder="Tell customers what makes your shop unique. Mention your specialties, years of experience, or any special equipment you have."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="contact@melbourneautocare.com.au"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className={`pl-10 ${hasFieldError('email') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    {hasFieldError('email') && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {getFieldError('email') && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError('email')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="(03) 9XXX XXXX or 04XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className={`pl-10 ${hasFieldError('phone') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    {hasFieldError('phone') && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {getFieldError('phone') && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError('phone')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Website/Social Media</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="https://www.yourshop.com.au or @yourshop"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    className={`pl-10 ${hasFieldError('website') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                  {hasFieldError('website') && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                {getFieldError('website') && (
                  <p className="text-xs text-red-600 mt-1">{getFieldError('website')}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Optional: Your website URL, Facebook page, or Instagram handle
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Street Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="123 Collins Street"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Suburb *</label>
                    <Input
                      placeholder="Melbourne"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Postcode *</label>
                    <div className="relative">
                      <Input
                        placeholder="3000"
                        value={formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                        className={hasFieldError('zipCode') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 pr-10' : ''}
                        maxLength={4}
                      />
                      {hasFieldError('zipCode') && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                      )}
                    </div>
                    {getFieldError('zipCode') && (
                      <p className="text-xs text-red-600 mt-1">{getFieldError('zipCode')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Service Menu & Pricing</h3>
                <p className="text-slate-600">Create flexible service packages and define what&apos;s included</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowServicePreview(!showServicePreview)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showServicePreview ? 'Hide' : 'Preview'}
                </Button>
              </div>
            </div>

            {showServicePreview ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <ServiceMenuPreview 
                  serviceMenuData={serviceMenuData} 
                  shopName={formData.shopName || "Your Auto Shop"}
                />
              </div>
            ) : (
              <>
                <ServicePackageBuilder
                  initialData={serviceMenuData}
                  onDataChange={setServiceMenuData}
                />

                {/* Shop Configuration */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Shop Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Service Bays *</label>
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <select
                            value={formData.serviceBays}
                            onChange={(e) => updateFormData("serviceBays", e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="1">1 Bay</option>
                            <option value="2">2 Bays</option>
                            <option value="3">3 Bays</option>
                            <option value="4">4 Bays</option>
                            <option value="5">5+ Bays</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Operating Hours *</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <select
                            value={formData.operatingHours}
                            onChange={(e) => updateFormData("operatingHours", e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="7:00 AM - 5:00 PM">7:00 AM - 5:00 PM</option>
                            <option value="8:00 AM - 5:00 PM">8:00 AM - 5:00 PM</option>
                            <option value="8:00 AM - 6:00 PM">8:00 AM - 6:00 PM</option>
                            <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Payment Setup</h3>
              <p className="text-slate-600">Configure payment methods and business information</p>
            </div>
            
            <PaymentSetup
              initialData={paymentData}
              onDataChange={(data) => setPaymentData(data as typeof paymentData)}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Business Hours</h3>
              <p className="text-slate-600">Set your operating hours and availability</p>
            </div>
            
            <BusinessHoursSetup
              initialData={businessHoursData}
              onDataChange={(data) => setBusinessHoursData(data as typeof businessHoursData)}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent mb-4">
                Ready to Launch Your Shop!
              </h3>
              <p className="text-slate-600 mb-8">
                Your mechanic shop is configured and ready to start accepting bookings through the marketplace platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Shop Profile Complete</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Service Menu Configured</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Payment Setup Complete</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span>Ready for Bookings</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                🚀 Your shop will be visible to customers in your area within 24 hours
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 p-6 relative">
      {/* Success Completion Overlay */}
      {isCompleting && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-16 shadow-xl border border-blue-200/50">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent mb-4">
                Setup Complete!
              </h2>
              
              <p className="text-xl text-slate-600 mb-8">
                Welcome to Auto Serve
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-500">Opening dashboard...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent">
              Shop Profile Setup
            </h1>
            <p className="text-xl text-slate-600 mt-2">
              Complete your automotive shop profile to get started with Auto Serve
            </p>
          </div>
          <Button
            variant="outline"
            className="border-blue-200 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Progress Steps */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 sticky top-0 z-20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeStep === step.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : activeStep > step.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {activeStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      React.createElement(step.icon, { className: "h-4 w-4" })
                    )}
                    <span>{step.title}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-slate-200 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStep === 1}
            className="border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            {activeStep < steps.length ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
              >
                Next Step
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}