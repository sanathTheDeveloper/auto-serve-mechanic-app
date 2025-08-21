"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PaymentSetup } from "@/components/PaymentSetup";
import { BusinessHoursSetup } from "@/components/BusinessHoursSetup";
import {
  validateEmail,
  validateAustralianPhone,
  validateAustralianPostcode,
  validateWebsiteUrl,
} from "@/lib/validation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  AlertCircle,
  Star,
  Award,
  Upload,
  X,
  Shield,
  CheckCircle,
  Camera,
  Plus,
  Trash2,
  Clock,
  CreditCard,
  Info,
} from "lucide-react";

interface ShopProfileData {
  shopName: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  photos: string[];
  specialties: string[];
}

interface Certification {
  id: string;
  name: string;
  document?: File;
}

interface ShopProfileSettingsProps {
  saveRef?: React.RefObject<(() => Promise<void>) | null>;
}

export function ShopProfileSettings({ saveRef }: ShopProfileSettingsProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certDocInputRef = useRef<HTMLInputElement>(null);

  // Profile Data State
  const [profileData, setProfileData] = useState<ShopProfileData>({
    shopName: user?.shopName || "",
    description: "",
    email: user?.email || "",
    phone: user?.phone || "",
    website: "",
    address: "",
    city: "",
    state: "Victoria",
    zipCode: "",
    photos: [],
    specialties: [],
  });

  // Credentials State
  const [motorVehicleLicense] = useState("MVR12345");
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertName, setNewCertName] = useState("");

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
      taxRate: 10,
    },
  });

  const [businessHoursData, setBusinessHoursData] = useState({
    schedule: [],
    timezone: "Australia/Melbourne",
    lunchBreak: {
      enabled: false,
      start: "12:00",
      end: "13:00",
    },
    specialDays: [],
  });

  // UI State
  const [activeTab, setActiveTab] = useState("shop-details");
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const specialtyOptions = [
    "European Cars",
    "Japanese Cars",
    "American Cars",
    "Luxury Vehicles",
    "4x4 & SUV Specialist",
    "EV Certified",
    "Hybrid Specialist",
    "Diesel Specialist",
    "Performance Tuning",
    "Classic Cars",
    "Fleet Services",
    "Mobile Service",
    "Emergency Repairs",
    "Roadside Assistance",
  ];

  const updateProfileData = (
    field: keyof ShopProfileData,
    value: string | string[]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Real-time validation
    if (typeof value === "string") {
      validateField(field, value);
    }
  };

  const validateField = (field: string, value: string) => {
    let validation: { isValid: boolean; message?: string } = { isValid: true };

    switch (field) {
      case "email":
        validation = validateEmail(value);
        break;
      case "phone":
        validation = validateAustralianPhone(value);
        break;
      case "zipCode":
        validation = validateAustralianPostcode(value);
        break;
      case "website":
        validation = validateWebsiteUrl(value);
        break;
    }

    if (!validation.isValid && validation.message) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: validation.message || "",
      }));
    }
  };

  const getFieldError = (field: string) => validationErrors[field];
  const hasFieldError = (field: string) => !!validationErrors[field];

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newPhotos = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setProfileData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 10), // Max 10 photos
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setProfileData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const addCertification = () => {
    if (!newCertName.trim()) return;

    const newCert: Certification = {
      id: Date.now().toString(),
      name: newCertName.trim(),
    };

    setCertifications((prev) => [...prev, newCert]);
    setNewCertName("");
  };

  const removeCertification = (id: string) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== id));
  };

  const handleCertDocumentUpload = (certId: string, file: File) => {
    setCertifications((prev) =>
      prev.map((cert) =>
        cert.id === certId ? { ...cert, document: file } : cert
      )
    );
  };

  const handleSave = useCallback(async () => {
    try {
      // Simulate save operation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would save to your backend
      console.log("Saving profile data:", {
        profileData,
        motorVehicleLicense,
        certifications,
        paymentData,
        businessHoursData,
      });

      // Show success message or redirect
    } catch (error) {
      console.error("Save failed:", error);
    }
  }, [profileData, motorVehicleLicense, certifications, paymentData, businessHoursData]);

  const handleBusinessHoursChange = useCallback(
    (data: Record<string, unknown>) => {
      setBusinessHoursData(data as typeof businessHoursData);
    },
    []
  );

  const handlePaymentDataChange = useCallback(
    (data: Record<string, unknown>) => {
      setPaymentData(data as typeof paymentData);
    },
    []
  );

  // Set the save function in the ref so the dashboard can call it
  useEffect(() => {
    if (saveRef) {
      saveRef.current = handleSave;
    }
  }, [saveRef, handleSave]);

  return (
    <div className="space-y-6">
      {/* Clean Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8">
          <TabsList className="flex w-full bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm p-1 gap-1">
            <TabsTrigger
              value="shop-details"
              className="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-slate-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-blue-500 data-[state=active]:hover:to-blue-600"
            >
              <Building2 className="h-4 w-4" />
              <span className="font-medium text-sm">Shop Details</span>
            </TabsTrigger>

            <TabsTrigger
              value="business-payouts"
              className="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-slate-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-blue-500 data-[state=active]:hover:to-blue-600"
            >
              <CreditCard className="h-4 w-4" />
              <span className="font-medium text-sm">Business & Payouts</span>
            </TabsTrigger>

            <TabsTrigger
              value="credentials-trust"
              className="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-slate-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-blue-500 data-[state=active]:hover:to-blue-600"
            >
              <Shield className="h-4 w-4" />
              <span className="font-medium text-sm">Credentials & Trust</span>
            </TabsTrigger>

            <TabsTrigger
              value="business-hours"
              className="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-slate-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-blue-500 data-[state=active]:hover:to-blue-600"
            >
              <Clock className="h-4 w-4" />
              <span className="font-medium text-sm">Business Hours</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Shop Details Tab */}
        <TabsContent value="shop-details" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Building2 className="h-5 w-5 text-blue-500" />
                Business Information
              </CardTitle>
              <p className="text-slate-600">
                Update your shop&rsquo;s basic information and contact details
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Shop Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Melbourne Auto Care"
                      value={profileData.shopName}
                      onChange={(e) =>
                        updateProfileData("shopName", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="contact@melbourneautocare.com.au"
                      value={profileData.email}
                      onChange={(e) =>
                        updateProfileData("email", e.target.value)
                      }
                      className={`pl-10 ${
                        hasFieldError("email")
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    {hasFieldError("email") && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {getFieldError("email") && (
                    <p className="text-sm text-red-600 mt-1">
                      {getFieldError("email")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="(03) 9XXX XXXX or 04XX XXX XXX"
                      value={profileData.phone}
                      onChange={(e) =>
                        updateProfileData("phone", e.target.value)
                      }
                      className={`pl-10 ${
                        hasFieldError("phone")
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    {hasFieldError("phone") && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {getFieldError("phone") && (
                    <p className="text-sm text-red-600 mt-1">
                      {getFieldError("phone")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website/Social Media
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="https://www.yourshop.com.au or @yourshop"
                      value={profileData.website}
                      onChange={(e) =>
                        updateProfileData("website", e.target.value)
                      }
                      className={`pl-10 ${
                        hasFieldError("website")
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    {hasFieldError("website") && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {getFieldError("website") && (
                    <p className="text-sm text-red-600 mt-1">
                      {getFieldError("website")}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Description
                </label>
                <textarea
                  placeholder="Tell customers what makes your shop unique. Mention your specialties, years of experience, or any special equipment you have."
                  value={profileData.description}
                  onChange={(e) =>
                    updateProfileData("description", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                  rows={4}
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-800">
                  Business Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="123 Collins Street"
                        value={profileData.address}
                        onChange={(e) =>
                          updateProfileData("address", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postcode *
                    </label>
                    <Input
                      placeholder="3000"
                      value={profileData.zipCode}
                      onChange={(e) =>
                        updateProfileData("zipCode", e.target.value)
                      }
                      className={
                        hasFieldError("zipCode")
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }
                      maxLength={4}
                    />
                    {getFieldError("zipCode") && (
                      <p className="text-sm text-red-600 mt-1">
                        {getFieldError("zipCode")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Suburb *
                    </label>
                    <Input
                      placeholder="Melbourne"
                      value={profileData.city}
                      onChange={(e) =>
                        updateProfileData("city", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State *
                    </label>
                    <select
                      value={profileData.state}
                      onChange={(e) =>
                        updateProfileData("state", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Victoria">Victoria</option>
                      <option value="New South Wales">New South Wales</option>
                      <option value="Queensland">Queensland</option>
                      <option value="Western Australia">
                        Western Australia
                      </option>
                      <option value="South Australia">South Australia</option>
                      <option value="Tasmania">Tasmania</option>
                      <option value="Northern Territory">
                        Northern Territory
                      </option>
                      <option value="Australian Capital Territory">
                        Australian Capital Territory
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workshop Photo Gallery */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Camera className="h-5 w-5 text-blue-500" />
                Workshop Photo Gallery
              </CardTitle>
              <p className="text-slate-600">
                Add high-quality photos of your workshop to build customer trust
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <Camera className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-800 mb-2">
                  Add Workshop Photos
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Upload images of your storefront, service bays, and equipment
                </p>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Photos
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  JPG, PNG, or WebP • Max 10 photos • 5MB per photo
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* Photo Grid */}
              {profileData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profileData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                        <Image
                          src={photo}
                          alt={`Workshop photo ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                  <span className="text-slate-600">Uploading photos...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shop Specialties */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Star className="h-5 w-5 text-blue-500" />
                Shop Specialties
              </CardTitle>
              <p className="text-slate-600">
                Select your areas of expertise to help customers find you
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {specialtyOptions.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => toggleSpecialty(specialty)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      profileData.specialties.includes(specialty)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-sm font-medium">{specialty}</div>
                  </button>
                ))}
              </div>

              {profileData.specialties.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Selected Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business & Payouts Tab */}
        <TabsContent value="business-payouts" className="space-y-6">
          <PaymentSetup
            initialData={paymentData}
            onDataChange={handlePaymentDataChange}
          />
        </TabsContent>

        {/* Credentials & Trust Tab */}
        <TabsContent value="credentials-trust" className="space-y-6">
          {/* Motor Vehicle Repairer&rsquo;s Licence */}
          <div className="p-6 bg-gradient-to-r from-emerald-50/80 to-blue-50/80 rounded-2xl border border-emerald-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-800">
                  Motor Vehicle Repairer&rsquo;s Licence
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-3">
                  Licence Number *
                </label>
                <div className="relative">
                  <Input
                    placeholder="MVR12345"
                    value={motorVehicleLicense}
                    disabled={true}
                    className="pl-12 h-12 text-base border-emerald-300 bg-emerald-50/50 cursor-not-allowed"
                  />
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />

                  {/* Status Indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 border-emerald-200 border">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Verified</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This licence has been verified and cannot be changed
                </p>
              </div>

              {/* Contact Support Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">
                      Need to Update Your Licence?
                    </h4>
                    <p className="text-sm text-amber-700 mb-2">
                      Your Motor Vehicle Repairer&rsquo;s Licence has been
                      verified and cannot be changed directly. If you need to
                      update your licence information, please contact Auto Serve
                      customer support.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-amber-600">
                      <span>📧 support@autoserve.com.au</span>
                      <span>•</span>
                      <span>📞 1300 AUTO SERVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications & Qualifications */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Award className="h-5 w-5 text-blue-500" />
                Certifications & Qualifications
              </CardTitle>
              <p className="text-slate-600">
                Showcase your professional certifications and training
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Certification */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Certification name (e.g., VACC Accredited Member)"
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={addCertification}
                  disabled={!newCertName.trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Certifications List */}
              {certifications.length > 0 && (
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <Card key={cert.id} className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800">
                              {cert.name}
                            </h4>
                            {cert.document ? (
                              <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                                <CheckCircle className="h-3 w-3" />
                                Document uploaded
                              </p>
                            ) : (
                              <p className="text-sm text-slate-500 mt-1">
                                No document uploaded
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => certDocInputRef.current?.click()}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(cert.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <input
                ref={certDocInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && certifications.length > 0) {
                    // For demo, upload to the last added certification
                    handleCertDocumentUpload(
                      certifications[certifications.length - 1].id,
                      file
                    );
                  }
                }}
                className="hidden"
              />

              {certifications.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Award className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">No Certifications Added</p>
                  <p className="text-sm">
                    Add your professional certifications to build customer trust
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours Tab */}
        <TabsContent value="business-hours" className="space-y-6">
          <BusinessHoursSetup
            initialData={businessHoursData}
            onDataChange={handleBusinessHoursChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
