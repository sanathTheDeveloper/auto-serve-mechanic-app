"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormSection, FormGrid } from "@/components/ui/form-field";
import { EnhancedInput } from "@/components/ui/enhanced-input";
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea";
import { PricingCard, AddServiceCard } from "@/components/ui/pricing-card";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Save,
  ArrowLeft,
  CheckCircle,
  Wrench,
  Users,
  Award,
  DollarSign,
  CreditCard,
  Car,
  Settings,
} from "lucide-react";

type BusinessHours = { open: string; close: string; closed: boolean };

export default function ShopProfilePage() {
  const [activeStep, setActiveStep] = useState(1);
  const formTopRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    // Basic Information
    shopName: "",
    description: "",
    email: "",
    phone: "",
    website: "",

    // Location
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Business Hours
    monday: { open: "08:00", close: "18:00", closed: false },
    tuesday: { open: "08:00", close: "18:00", closed: false },
    wednesday: { open: "08:00", close: "18:00", closed: false },
    thursday: { open: "08:00", close: "18:00", closed: false },
    friday: { open: "08:00", close: "18:00", closed: false },
    saturday: { open: "09:00", close: "17:00", closed: false },
    sunday: { open: "10:00", close: "16:00", closed: true },

    // Services
    services: ["Oil Change", "Brake Service", "Tire Rotation"],
    customServices: [] as string[],
    specialties: "",

    // Pricing
    servicePricing: [
      {
        id: "1",
        name: "Oil Change",
        basePrice: 49.99,
        duration: 45,
        category: "Maintenance",
        description: "Full synthetic oil change with 21-point inspection",
      },
      {
        id: "2",
        name: "Brake Inspection",
        basePrice: 0,
        duration: 30,
        category: "Inspection",
        description: "Complete brake system inspection",
        isPopular: false,
      },
    ],
    laborRate: 125,

    // Capacity & Equipment
    totalBays: 4,
    lifts: 3,
    maxVehiclesPerDay: 20,
    equipmentList: [
      "Alignment Machine",
      "Tire Changer",
      "Brake Lathe",
      "AC Recovery System",
    ],

    // Payment Methods
    acceptedPayments: ["Cash", "Credit Card", "Debit Card"],
    creditCards: ["Visa", "Mastercard", "American Express"],
    paymentTerms: "Payment due upon completion",

    // Business Payment Details (where shop receives money)
    businessPaymentMethod: "card", // "card" or "bank"
    businessCardNumber: "",
    businessCardHolderName: "",
    businessCardExpiry: "",
    businessCardCvv: "",
    businessBankName: "",
    businessAccountNumber: "",
    businessRoutingNumber: "",
    businessAccountHolderName: "",

    // Team
    teamSize: "",
    certifications: [] as string[],
    yearsInBusiness: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: "Basic", short: "Info", icon: Building2 },
    { id: 2, title: "Location", short: "Loc", icon: MapPin },
    { id: 3, title: "Hours", short: "Hrs", icon: Clock },
    { id: 4, title: "Services", short: "Svc", icon: Wrench },
    { id: 5, title: "Pricing", short: "Price", icon: DollarSign },
    { id: 6, title: "Capacity", short: "Cap", icon: Car },
    { id: 7, title: "Payment", short: "Pay", icon: CreditCard },
    { id: 8, title: "Team", short: "Team", icon: Users },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.shopName) newErrors.shopName = "Shop name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        break;
      case 2:
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    if (validateStep(activeStep)) {
      // Save logic here
      console.log("Saving profile...", formData);
    }
  };

  const handleGoToStep = (stepId: number) => {
    setActiveStep(Math.max(1, Math.min(stepId, steps.length)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeStep]);

  const updateFormData = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <FormSection
            title="Basic Information"
            description="Tell us about your automotive service shop"
          >
            <FormGrid columns={1}>
              <FormField label="Shop Name" required error={errors.shopName}>
                <EnhancedInput
                  icon={<Building2 className="h-4 w-4" />}
                  placeholder="AutoServe Pro Shop"
                  value={formData.shopName}
                  onChange={(e) => updateFormData("shopName", e.target.value)}
                  error={!!errors.shopName}
                />
              </FormField>
            </FormGrid>

            <FormField
              label="Description"
              description="Brief description of your services and expertise"
            >
              <EnhancedTextarea
                placeholder="We provide professional automotive services with over 20 years of experience..."
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                maxLength={500}
                showCount
                rows={4}
              />
            </FormField>

            <FormGrid>
              <FormField label="Email Address" required error={errors.email}>
                <EnhancedInput
                  icon={<Mail className="h-4 w-4" />}
                  type="email"
                  placeholder="shop@autoserve.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  error={!!errors.email}
                />
              </FormField>

              <FormField label="Phone Number" required error={errors.phone}>
                <EnhancedInput
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  error={!!errors.phone}
                />
              </FormField>
            </FormGrid>

            <FormField
              label="Website"
              description="Optional - your shop's website URL"
            >
              <EnhancedInput
                icon={<Globe className="h-4 w-4" />}
                placeholder="https://autoservepro.com"
                value={formData.website}
                onChange={(e) => updateFormData("website", e.target.value)}
              />
            </FormField>
          </FormSection>
        );

      case 2:
        return (
          <FormSection
            title="Shop Location"
            description="Where can customers find your shop?"
          >
            <FormField label="Street Address" required error={errors.address}>
              <EnhancedInput
                icon={<MapPin className="h-4 w-4" />}
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                error={!!errors.address}
              />
            </FormField>

            <FormGrid columns={3}>
              <FormField label="City" required error={errors.city}>
                <EnhancedInput
                  placeholder="San Francisco"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  error={!!errors.city}
                />
              </FormField>

              <FormField label="State" required error={errors.state}>
                <EnhancedInput
                  placeholder="CA"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  error={!!errors.state}
                />
              </FormField>

              <FormField label="ZIP Code" required error={errors.zipCode}>
                <EnhancedInput
                  placeholder="94105"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  error={!!errors.zipCode}
                />
              </FormField>
            </FormGrid>
          </FormSection>
        );

      case 3:
        return (
          <FormSection
            title="Business Hours"
            description="When are you open for business?"
          >
            <div className="space-y-4">
              {Object.entries(formData)
                .filter(([key]) =>
                  [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].includes(key)
                )
                .map(([day, hours]) => {
                  const h = hours as BusinessHours;
                  return (
                    <div
                      key={day}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
                    >
                      <div className="w-20 font-medium text-slate-700 capitalize">
                        {day}
                      </div>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={h.closed}
                          onChange={(e) =>
                            updateFormData(
                              day as keyof typeof formData,
                              {
                                ...h,
                                closed: e.target.checked,
                              } as BusinessHours
                            )
                          }
                          className="rounded border-blue-300 text-blue-500 focus:ring-blue-500/20"
                        />
                        <span className="text-sm text-slate-600">Closed</span>
                      </label>

                      {!h.closed && (
                        <div className="flex items-center gap-2 flex-1">
                          <EnhancedInput
                            type="time"
                            value={h.open}
                            onChange={(e) =>
                              updateFormData(
                                day as keyof typeof formData,
                                {
                                  ...h,
                                  open: e.target.value,
                                } as BusinessHours
                              )
                            }
                            className="w-32"
                          />
                          <span className="text-slate-500">to</span>
                          <EnhancedInput
                            type="time"
                            value={h.close}
                            onChange={(e) =>
                              updateFormData(
                                day as keyof typeof formData,
                                {
                                  ...h,
                                  close: e.target.value,
                                } as BusinessHours
                              )
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </FormSection>
        );

      case 4:
        return (
          <FormSection
            title="Services & Specialties"
            description="What automotive services do you offer?"
          >
            {/* Service Types */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">Service Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                  <h4 className="font-medium text-slate-800 mb-2">Basic Service</h4>
                  <p className="text-sm text-slate-600">Oil change, fluid check, battery test, visual inspection</p>
                </div>
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/30">
                  <h4 className="font-medium text-slate-800 mb-2">Full Service</h4>
                  <p className="text-sm text-slate-600">Basic service + 21-point inspection, tire rotation, brake check</p>
                </div>
              </div>
            </div>

            {/* Main Services */}
            <FormField
              label="Services Offered"
              description="Select the services your shop provides"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Oil Change",
                  "Brake Service", 
                  "Tire Rotation",
                  "Engine Diagnostic",
                  "Transmission Service",
                  "A/C Repair",
                  "Battery Replacement",
                  "Tune-up",
                  "Alignment",
                  "Inspection",
                  "Detailing",
                  "Towing",
                ].map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData("services", [
                            ...formData.services,
                            service,
                          ]);
                        } else {
                          updateFormData(
                            "services",
                            formData.services.filter((s) => s !== service)
                          );
                        }
                      }}
                      className="rounded border-blue-300 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-slate-700">{service}</span>
                  </label>
                ))}
              </div>
            </FormField>

            {/* Custom Services */}
            <FormField
              label="Additional Services"
              description="Add any other services you offer"
            >
              <div className="space-y-2">
                {formData.customServices && formData.customServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <EnhancedInput
                      placeholder="Service name"
                      value={service}
                      onChange={(e) => {
                        const updated = [...(formData.customServices || [])];
                        updated[index] = e.target.value;
                        updateFormData("customServices", updated);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = (formData.customServices || []).filter((_, i) => i !== index);
                        updateFormData("customServices", updated);
                      }}
                      className="text-slate-600"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    const current = formData.customServices || [];
                    updateFormData("customServices", [...current, ""]);
                  }}
                  className="text-blue-600 border-blue-300"
                >
                  + Add Service
                </Button>
              </div>
            </FormField>

            <FormField
              label="Specialties & Equipment"
              description="Describe any specialized services or equipment"
            >
              <EnhancedTextarea
                placeholder="We specialize in European vehicles and have state-of-the-art diagnostic equipment..."
                value={formData.specialties}
                onChange={(e) => updateFormData("specialties", e.target.value)}
                maxLength={300}
                showCount
                rows={3}
              />
            </FormField>
          </FormSection>
        );

      case 5:
        return (
          <FormSection
            title="Service Pricing"
            description="Set pricing for your services and labor rates"
          >
            <FormField
              label="Hourly Labor Rate"
              description="Standard hourly rate for labor"
            >
              <EnhancedInput
                icon={<DollarSign className="h-4 w-4" />}
                type="number"
                step="0.01"
                placeholder="125.00"
                value={formData.laborRate}
                onChange={(e) =>
                  updateFormData("laborRate", parseFloat(e.target.value) || 0)
                }
                suffix={<span className="text-slate-500">/hour</span>}
              />
            </FormField>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-700">Service Pricing</h4>
                <span className="text-xs text-slate-500">
                  {formData.servicePricing.length} services
                </span>
              </div>
              <div className="space-y-3">
                {formData.servicePricing.slice(0, 3).map((service) => (
                  <PricingCard
                    key={service.id}
                    service={service}
                    editable
                    className="w-full"
                    onEdit={(updatedService) => {
                      const updated = formData.servicePricing.map((s) =>
                        s.id === updatedService.id
                          ? (updatedService as (typeof formData.servicePricing)[number])
                          : s
                      ) as typeof formData.servicePricing;
                      updateFormData("servicePricing", updated);
                    }}
                    onDelete={(id) => {
                      const updated = formData.servicePricing.filter(
                        (s) => s.id !== id
                      ) as typeof formData.servicePricing;
                      updateFormData("servicePricing", updated);
                    }}
                  />
                ))}
                {formData.servicePricing.length > 3 && (
                  <div className="text-center py-3 text-sm text-slate-500 bg-slate-50 rounded-lg">
                    +{formData.servicePricing.length - 3} more services
                  </div>
                )}
                <AddServiceCard
                  onAdd={(newService) => {
                    const serviceWithId = {
                      ...newService,
                      description:
                        (newService as { description?: string }).description ??
                        "",
                      id: Date.now().toString(),
                    } as (typeof formData.servicePricing)[number];
                    const next = [
                      ...formData.servicePricing,
                      serviceWithId,
                    ] as typeof formData.servicePricing;
                    updateFormData("servicePricing", next);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </FormSection>
        );

      case 6:
        return (
          <FormSection
            title="Shop Capacity & Equipment"
            description="Tell us about your facility and equipment"
          >
            <FormGrid columns={3}>
              <FormField
                label="Service Bays"
                description="Total number of service bays"
              >
                <EnhancedInput
                  icon={<Car className="h-4 w-4" />}
                  type="number"
                  placeholder="4"
                  value={formData.totalBays}
                  onChange={(e) =>
                    updateFormData("totalBays", parseInt(e.target.value) || 0)
                  }
                />
              </FormField>

              <FormField
                label="Vehicle Lifts"
                description="Number of hydraulic lifts"
              >
                <EnhancedInput
                  icon={<Settings className="h-4 w-4" />}
                  type="number"
                  placeholder="3"
                  value={formData.lifts}
                  onChange={(e) =>
                    updateFormData("lifts", parseInt(e.target.value) || 0)
                  }
                />
              </FormField>

              <FormField
                label="Daily Capacity"
                description="Max vehicles per day"
              >
                <EnhancedInput
                  icon={<Car className="h-4 w-4" />}
                  type="number"
                  placeholder="20"
                  value={formData.maxVehiclesPerDay}
                  onChange={(e) =>
                    updateFormData(
                      "maxVehiclesPerDay",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </FormField>
            </FormGrid>

            <FormField
              label="Equipment & Tools"
              description="Select your available equipment"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Alignment Machine",
                  "Tire Changer",
                  "Brake Lathe",
                  "AC Recovery System",
                  "Diagnostic Scanner",
                  "Transmission Jack",
                  "Engine Hoist",
                  "Air Compressor",
                  "Wheel Balancer",
                  "Paint Booth",
                  "Welder",
                  "Parts Washer",
                ].map((equipment) => (
                  <label
                    key={equipment}
                    className="flex items-center gap-2 p-2 rounded border border-blue-200/30 hover:bg-blue-50/30 cursor-pointer transition-all text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.equipmentList.includes(equipment)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData("equipmentList", [
                            ...formData.equipmentList,
                            equipment,
                          ]);
                        } else {
                          updateFormData(
                            "equipmentList",
                            formData.equipmentList.filter(
                              (eq) => eq !== equipment
                            )
                          );
                        }
                      }}
                      className="rounded border-blue-300 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-slate-700">{equipment}</span>
                  </label>
                ))}
              </div>
            </FormField>
          </FormSection>
        );

      case 7:
        return (
          <FormSection
            title="Payment Methods & Terms"
            description="Configure payment options for your customers"
          >
            <FormField label="Accepted Payment Methods">
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Cash",
                  "Credit Card",
                  "Debit Card",
                  "Check",
                  "Mobile Payment",
                  "Bank Transfer",
                  "Buy Now Pay Later",
                  "Fleet Account",
                ].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-2 p-2 rounded border border-blue-200/30 hover:bg-blue-50/30 cursor-pointer transition-all text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.acceptedPayments.includes(method)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData("acceptedPayments", [
                            ...formData.acceptedPayments,
                            method,
                          ]);
                        } else {
                          updateFormData(
                            "acceptedPayments",
                            formData.acceptedPayments.filter(
                              (p) => p !== method
                            )
                          );
                        }
                      }}
                      className="rounded border-blue-300 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-slate-700">{method}</span>
                  </label>
                ))}
              </div>
            </FormField>

            {formData.acceptedPayments.includes("Credit Card") && (
              <FormField label="Credit Card Brands">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Visa",
                    "Mastercard",
                    "American Express",
                    "Discover",
                    "Diners Club",
                    "JCB",
                    "UnionPay",
                  ].map((card) => (
                    <label
                      key={card}
                      className="flex items-center gap-2 p-2 rounded border border-blue-200/30 hover:bg-blue-50/30 cursor-pointer transition-all text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={formData.creditCards.includes(card)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData("creditCards", [
                              ...formData.creditCards,
                              card,
                            ]);
                          } else {
                            updateFormData(
                              "creditCards",
                              formData.creditCards.filter((c) => c !== card)
                            );
                          }
                        }}
                        className="rounded border-blue-300 text-blue-500 focus:ring-blue-500/20"
                      />
                      <span className="text-slate-700">{card}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            )}

            {/* Business Payment Details */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-2xl shadow-xl mt-8">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Payment Destination</h3>
                    <p className="text-blue-100 text-sm">Where your earnings will be deposited</p>
                  </div>
                </div>

                {/* Method Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <label
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.businessPaymentMethod === "card"
                        ? "border-white bg-white/20 shadow-lg"
                        : "border-white/30 hover:border-white/50 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessPaymentMethod"
                      value="card"
                      checked={formData.businessPaymentMethod === "card"}
                      onChange={(e) => updateFormData("businessPaymentMethod", e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Business Card</div>
                        <div className="text-xs text-blue-100">Credit or debit card</div>
                      </div>
                    </div>
                    {formData.businessPaymentMethod === "card" && (
                      <div className="absolute top-3 right-3 w-3 h-3 bg-orange-400 rounded-full"></div>
                    )}
                  </label>

                  <label
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.businessPaymentMethod === "bank"
                        ? "border-white bg-white/20 shadow-lg"
                        : "border-white/30 hover:border-white/50 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessPaymentMethod"
                      value="bank"
                      checked={formData.businessPaymentMethod === "bank"}
                      onChange={(e) => updateFormData("businessPaymentMethod", e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-lg">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Bank Account</div>
                        <div className="text-xs text-blue-100">Direct deposit</div>
                      </div>
                    </div>
                    {formData.businessPaymentMethod === "bank" && (
                      <div className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full"></div>
                    )}
                  </label>
                </div>

                {/* Card Form */}
                {formData.businessPaymentMethod === "card" && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="space-y-5">
                      <div className="relative">
                        <label className="block text-sm font-medium text-white mb-2">Card Holder Name</label>
                        <EnhancedInput
                          placeholder="John Doe"
                          value={formData.businessCardHolderName}
                          onChange={(e) => updateFormData("businessCardHolderName", e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-white mb-2">Card Number</label>
                        <EnhancedInput
                          placeholder="•••• •••• •••• 1234"
                          value={formData.businessCardNumber}
                          onChange={(e) => updateFormData("businessCardNumber", e.target.value)}
                          maxLength={19}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                        <div className="absolute right-3 top-10 flex gap-1">
                          <div className="w-6 h-4 bg-white/30 rounded-sm"></div>
                          <div className="w-6 h-4 bg-white/20 rounded-sm"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Expiry</label>
                          <EnhancedInput
                            placeholder="MM/YY"
                            value={formData.businessCardExpiry}
                            onChange={(e) => updateFormData("businessCardExpiry", e.target.value)}
                            maxLength={5}
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-orange-400 focus:ring-orange-400/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">CVV</label>
                          <EnhancedInput
                            placeholder="•••"
                            value={formData.businessCardCvv}
                            onChange={(e) => updateFormData("businessCardCvv", e.target.value)}
                            maxLength={4}
                            type="password"
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-orange-400 focus:ring-orange-400/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Form */}
                {formData.businessPaymentMethod === "bank" && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Account Holder</label>
                        <EnhancedInput
                          placeholder="AutoServe Pro LLC"
                          value={formData.businessAccountHolderName}
                          onChange={(e) => updateFormData("businessAccountHolderName", e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-green-400 focus:ring-green-400/20"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Bank Name</label>
                        <EnhancedInput
                          placeholder="Chase Bank"
                          value={formData.businessBankName}
                          onChange={(e) => updateFormData("businessBankName", e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-green-400 focus:ring-green-400/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Account Number</label>
                          <EnhancedInput
                            placeholder="123456789"
                            value={formData.businessAccountNumber}
                            onChange={(e) => updateFormData("businessAccountNumber", e.target.value)}
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-green-400 focus:ring-green-400/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Routing Number</label>
                          <EnhancedInput
                            placeholder="021000021"
                            value={formData.businessRoutingNumber}
                            onChange={(e) => updateFormData("businessRoutingNumber", e.target.value)}
                            maxLength={9}
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-green-400 focus:ring-green-400/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-400/30 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-400/20 rounded-full mt-0.5">
                      <CheckCircle className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div className="text-sm text-emerald-100">
                      <span className="font-semibold">Bank-level Security:</span> All payment information is encrypted with AES-256 and stored securely. We never store CVV numbers.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FormField
              label="Payment Terms"
              description="Describe your payment terms and policies"
            >
              <EnhancedTextarea
                placeholder="Payment due upon completion of service. We accept cash, credit cards, and checks. Fleet accounts available with approved credit..."
                value={formData.paymentTerms}
                onChange={(e) => updateFormData("paymentTerms", e.target.value)}
                maxLength={300}
                showCount
                rows={3}
              />
            </FormField>
          </FormSection>
        );

      case 8:
        return (
          <FormSection
            title="Team & Experience"
            description="Tell us about your team and credentials"
          >
            <FormGrid>
              <FormField
                label="Team Size"
                description="Number of technicians and staff"
              >
                <EnhancedInput
                  icon={<Users className="h-4 w-4" />}
                  placeholder="5"
                  value={formData.teamSize}
                  onChange={(e) => updateFormData("teamSize", e.target.value)}
                />
              </FormField>

              <FormField label="Years in Business">
                <EnhancedInput
                  icon={<Award className="h-4 w-4" />}
                  placeholder="15"
                  value={formData.yearsInBusiness}
                  onChange={(e) =>
                    updateFormData("yearsInBusiness", e.target.value)
                  }
                />
              </FormField>
            </FormGrid>

            <FormField
              label="Certifications & Awards"
              description="ASE certifications, manufacturer training, awards, etc."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "ASE Certified",
                  "AAA Approved",
                  "Better Business Bureau",
                  "Manufacturer Certified",
                  "NAPA AutoCare",
                  "Bosch Service",
                  "AC Delco",
                  "Customer Choice Award",
                ].map((cert) => (
                  <label
                    key={cert}
                    className="flex items-center gap-2 p-3 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-orange-50/50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData("certifications", [
                            ...formData.certifications,
                            cert,
                          ]);
                        } else {
                          updateFormData(
                            "certifications",
                            formData.certifications.filter((c) => c !== cert)
                          );
                        }
                      }}
                      className="rounded border-blue-300 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-slate-700">{cert}</span>
                  </label>
                ))}
              </div>
            </FormField>
          </FormSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent">
              Shop Profile Setup
            </h1>
            <p className="text-slate-600 mt-1">
              Complete your automotive shop profile to get started
            </p>
          </div>
          <Button
            variant="outline"
            className="border-blue-200 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Progress Steps */}
        <Card className="bg-white shadow-sm border border-slate-200 sticky top-0 z-20">
          <CardContent className="p-4">
            {/* Mobile: Vertical progress */}
            <div className="md:hidden space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>
                  Step {activeStep} of {steps.length}
                </span>
                <span>
                  {Math.round((activeStep / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(activeStep / steps.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${"bg-gradient-to-r from-blue-500 to-blue-600 text-white"}`}
                >
                  {React.createElement(steps[activeStep - 1].icon, {
                    className: "h-4 w-4",
                  })}
                </div>
                <div>
                  <div className="font-medium text-slate-800">
                    {steps[activeStep - 1].title}
                  </div>
                  <div className="text-xs text-slate-500">Current Step</div>
                </div>
              </div>
            </div>

            {/* Desktop: Steps wrap to remove scrollbar */}
            <div
              className="hidden md:flex flex-wrap items-center justify-center gap-3"
              role="tablist"
              aria-label="Shop profile steps"
            >
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center flex-shrink-0 my-1"
                >
                  <button
                    type="button"
                    onClick={() => handleGoToStep(step.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleGoToStep(step.id);
                    }}
                    aria-current={activeStep === step.id ? "step" : undefined}
                    aria-label={`Go to ${step.title} step`}
                    tabIndex={0}
                    className={`flex items-center gap-2 px-4 h-10 rounded-full text-sm min-w-[110px] whitespace-nowrap ring-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                      activeStep === step.id
                        ? "bg-blue-600 text-white ring-blue-600"
                        : activeStep > step.id
                        ? "bg-blue-50 text-blue-700 ring-blue-200"
                        : "bg-white text-slate-600 ring-slate-200"
                    }`}
                  >
                    {activeStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      React.createElement(step.icon, { className: "h-4 w-4" })
                    )}
                    <span className="font-medium hidden lg:block">
                      {step.title}
                    </span>
                    <span className="font-medium lg:hidden">{step.short}</span>
                  </button>
                  {null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <div ref={formTopRef}>{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStep === 1}
            className="border-slate-300 text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              className="border-blue-200 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>

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
                onClick={handleSave}
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
