"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  FileText,
  User,
  Car,
  Calculator,
  Send,
  Save,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import { Invoice, InvoiceLineItem } from "@/types/invoice";

function CreateInvoicePageContent() {
  const router = useRouter();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    make: "",
    model: "",
    registration: "",
    color: "",
    vin: "",
  });
  
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: "1",
      description: "Basic Service",
      quantity: 1,
      unitPrice: 150,
      total: 150,
      type: "labor",
    },
  ]);
  
  const [gstRate] = useState(10);
  const [includeGst] = useState(true);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Pre-fill from URL params if coming from a job
  useEffect(() => {
    // Check for job data from URL params if needed
    const urlParams = new URLSearchParams(window.location.search);
    const jobData = urlParams.get("jobData");
    if (jobData) {
      try {
        const job = JSON.parse(decodeURIComponent(jobData));
        setCustomerInfo({
          name: job.customer || "",
          email: job.email || "",
          phone: job.phone || "",
          address: "",
        });
        setVehicleInfo({
          year: "2020",
          make: job.vehicle?.split(" ")[0] || "",
          model: job.vehicle?.split(" ").slice(1).join(" ") || "",
          registration: job.registration || "",
          color: "",
          vin: "",
        });
        if (job.service) {
          setLineItems([
            {
              id: "1",
              description: job.service,
              quantity: 1,
              unitPrice: job.finalPrice || job.quote?.total || 0,
              total: job.finalPrice || job.quote?.total || 0,
              type: "labor",
            },
          ]);
        }
      } catch (error) {
        console.error("Error parsing job data:", error);
      }
    }
  }, []);

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateGst = () => {
    return includeGst ? (calculateSubtotal() * gstRate) / 100 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGst();
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: `new-${Date.now()}`,
      description: "Additional Service",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      type: "additional",
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `INV-${year}${month}${day}-${random}`;
  };

  const isFormValid = () => {
    return (
      customerInfo.name.trim() &&
      customerInfo.email.trim() &&
      lineItems.every(item => item.description.trim() && item.unitPrice > 0) &&
      calculateTotal() > 0
    );
  };

  const handleSendInvoice = async () => {
    if (!isFormValid()) return;

    setIsProcessing(true);
    
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      jobId: `job-${Date.now()}`,
      customerId: `customer-${Date.now()}`,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      vehicleInfo: {
        year: parseInt(vehicleInfo.year) || new Date().getFullYear(),
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        registration: vehicleInfo.registration,
      },
      lineItems,
      subtotal: calculateSubtotal(),
      gstAmount: calculateGst(),
      gstRate,
      total: calculateTotal(),
      status: "sent",
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: invoiceNotes,
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store invoice data and redirect
    localStorage.setItem('newInvoice', JSON.stringify(invoice));
    router.push('/dashboard?page=payments&invoiceCreated=true');
  };

  const handleSaveDraft = async () => {
    if (!customerInfo.name.trim()) return;

    const invoice: Invoice = {
      id: `draft-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      jobId: `job-${Date.now()}`,
      customerId: `customer-${Date.now()}`,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      vehicleInfo: {
        year: parseInt(vehicleInfo.year) || new Date().getFullYear(),
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        registration: vehicleInfo.registration,
      },
      lineItems,
      subtotal: calculateSubtotal(),
      gstAmount: calculateGst(),
      gstRate,
      total: calculateTotal(),
      status: "draft",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: invoiceNotes,
    };

    localStorage.setItem('draftInvoice', JSON.stringify(invoice));
    router.push('/dashboard?page=payments&draftSaved=true');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-blue-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                  Create Invoice
                </h1>
                <p className="text-sm text-slate-600">
                  Professional invoicing for auto services
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="bg-white hover:bg-slate-50"
              disabled={!customerInfo.name.trim() || isProcessing}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handleSendInvoice}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 min-w-[160px]"
              disabled={!isFormValid() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer & Vehicle Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Full Name *
                  </label>
                  <Input
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Smith"
                    className="h-10"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="h-10 pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+61 400 123 456"
                      className="h-10 pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Address
                  </label>
                  <Textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main Street, Suburb, State, Postcode"
                    className="h-20 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-500" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Year
                    </label>
                    <Input
                      value={vehicleInfo.year}
                      onChange={(e) => setVehicleInfo(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="2020"
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Make
                    </label>
                    <Input
                      value={vehicleInfo.make}
                      onChange={(e) => setVehicleInfo(prev => ({ ...prev, make: e.target.value }))}
                      placeholder="Toyota"
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Model
                  </label>
                  <Input
                    value={vehicleInfo.model}
                    onChange={(e) => setVehicleInfo(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Camry"
                    className="h-10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Registration
                    </label>
                    <Input
                      value={vehicleInfo.registration}
                      onChange={(e) => setVehicleInfo(prev => ({ ...prev, registration: e.target.value }))}
                      placeholder="ABC123"
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Color
                    </label>
                    <Input
                      value={vehicleInfo.color}
                      onChange={(e) => setVehicleInfo(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="Silver"
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    VIN (Optional)
                  </label>
                  <Input
                    value={vehicleInfo.vin}
                    onChange={(e) => setVehicleInfo(prev => ({ ...prev, vin: e.target.value }))}
                    placeholder="1HGBH41JXMN109186"
                    className="h-10"
                  />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Line Items */}
          <div className="space-y-6">
            {/* Service Line Items */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Service Line Items</CardTitle>
                  <Button
                    onClick={addLineItem}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-slate-200 rounded-xl space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            Service Description *
                          </label>
                          <Select
                            value={item.description}
                            onValueChange={(value) =>
                              updateLineItem(item.id, "description", value)
                            }
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic Service">Basic Service - Oil change, fluid check</SelectItem>
                              <SelectItem value="Full Service">Full Service - Comprehensive inspection</SelectItem>
                              <SelectItem value="Brake Service">Brake Service - Pads, fluid, inspection</SelectItem>
                              <SelectItem value="Tire Service">Tire Service - Rotation, balance, alignment</SelectItem>
                              <SelectItem value="Engine Diagnostics">Engine Diagnostics - Computer scan</SelectItem>
                              <SelectItem value="Battery Service">Battery Service - Test and replacement</SelectItem>
                              <SelectItem value="Air Conditioning">Air Conditioning - Service and repair</SelectItem>
                              <SelectItem value="Transmission Service">Transmission Service - Fluid and filter</SelectItem>
                              <SelectItem value="Cooling System">Cooling System - Radiator and hoses</SelectItem>
                              <SelectItem value="Additional Parts">Additional Parts - Filters, belts, etc.</SelectItem>
                              <SelectItem value="Labor Charges">Labor Charges - Additional work</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600 mb-1 block">
                              Quantity
                            </label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateLineItem(
                                  item.id,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="h-10"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 mb-1 block">
                              Unit Price ($)
                            </label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateLineItem(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="h-10"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 mb-1 block">
                              Total
                            </label>
                            <div className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-md flex items-center text-sm font-medium text-slate-700">
                              {formatCurrency(item.total)}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                      
                      {lineItems.length > 1 && (
                        <Button
                          onClick={() => removeLineItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-3 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Invoice Notes */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle>Invoice Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  placeholder="Add any additional notes, terms, or payment instructions for this invoice..."
                  className="h-24 resize-none"
                />
              </CardContent>
            </Card>

            {/* Invoice Summary */}
            <Card className="bg-blue-50/50 backdrop-blur-sm shadow-lg border border-blue-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-500" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Subtotal:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">GST (10%):</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(calculateGst())}
                  </span>
                </div>
                
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-slate-800">
                      Total:
                    </span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateInvoicePageContent />
    </Suspense>
  );
}