"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaymentSetup } from "@/components/PaymentSetup";
import { BusinessHoursSetup } from "@/components/BusinessHoursSetup";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
} from "lucide-react";

export function ShopProfileSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shopName: user?.shopName || "",
    description: "",
    email: user?.email || "",
    phone: user?.phone || "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSave = () => {
    // In a real app, this would persist the data to a backend
    console.log("Shop profile saved", {
      ...formData,
      paymentData,
      businessHoursData,
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
          Shop Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-700">
            Basic Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Shop Name
              </label>
              <Input
                value={formData.shopName}
                onChange={(e) => updateFormData("shopName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                Website
              </label>
              <Input
                value={formData.website}
                onChange={(e) => updateFormData("website", e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  updateFormData("description", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-700">Location</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                City
              </label>
              <Input
                value={formData.city}
                onChange={(e) => updateFormData("city", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                State
              </label>
              <Input
                value={formData.state}
                onChange={(e) => updateFormData("state", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Postcode
              </label>
              <Input
                value={formData.zipCode}
                onChange={(e) => updateFormData("zipCode", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Payment Setup */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-700">
            Payment Information
          </h3>
          <PaymentSetup
            initialData={paymentData}
            onDataChange={(data) => setPaymentData(data as typeof paymentData)}
          />
        </section>

        {/* Business Hours */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-700">
            Business Hours
          </h3>
          <BusinessHoursSetup
            initialData={businessHoursData}
            onDataChange={(data) =>
              setBusinessHoursData(data as typeof businessHoursData)
            }
          />
        </section>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShopProfileSettings;

