"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  FileText,
  User,
  Car,
  Calculator,
  Send,
  Save,
} from "lucide-react";
import { Invoice, InvoiceLineItem } from "@/types/invoice";
import { Job } from "@/types/booking";

interface InvoiceCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onInvoiceCreate: (invoice: Invoice) => void;
  onInvoiceDraft: (invoice: Invoice) => void;
}

export function InvoiceCreationDialog({
  isOpen,
  onClose,
  job,
  onInvoiceCreate,
  onInvoiceDraft,
}: InvoiceCreationDialogProps) {
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);
  const [gstRate] = useState(10); // 10% GST
  const [includeGst] = useState(true);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize line items from job data
  useEffect(() => {
    if (job) {
      const initialItems: InvoiceLineItem[] = [
        {
          id: "1",
          description: job.service,
          quantity: 1,
          unitPrice: job.finalPrice || job.quote?.total || 0,
          total: job.finalPrice || job.quote?.total || 0,
          type: "labor",
        },
      ];

      // Add any additional services or parts from the job
      if (job.additionalServices) {
        job.additionalServices.forEach((service, index) => {
          initialItems.push({
            id: `add-${index + 2}`,
            description: service.name,
            quantity: 1,
            unitPrice: service.price,
            total: service.price,
            type: "additional",
          });
        });
      }

      setLineItems(initialItems);
    }
  }, [job]);

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
          
          // Recalculate total when quantity or unitPrice changes
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
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      type: "additional",
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `INV-${year}${month}${day}-${random}`;
  };

  const handleSendInvoice = async () => {
    if (!job) return;

    setIsProcessing(true);
    
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      jobId: job.id,
      customerId: job.id, // Using job.id as customer reference
      customerName: job.customer,
      customerEmail: job.customerEmail || "",
      vehicleInfo: {
        year: 2020,
        make: job.vehicle.split(" ")[0] || "",
        model: job.vehicle.split(" ").slice(1).join(" ") || "",
        registration: job.registration || "",
      },
      lineItems,
      subtotal: calculateSubtotal(),
      gstAmount: calculateGst(),
      gstRate,
      total: calculateTotal(),
      status: "sent",
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      notes,
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onInvoiceCreate(invoice);
    setIsProcessing(false);
    onClose();
  };

  const handleSaveDraft = async () => {
    if (!job) return;

    const invoice: Invoice = {
      id: `draft-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      jobId: job.id,
      customerId: job.id,
      customerName: job.customer,
      customerEmail: job.customerEmail || "",
      vehicleInfo: {
        year: 2020,
        make: job.vehicle.split(" ")[0] || "",
        model: job.vehicle.split(" ").slice(1).join(" ") || "",
        registration: job.registration || "",
      },
      lineItems,
      subtotal: calculateSubtotal(),
      gstAmount: calculateGst(),
      gstRate,
      total: calculateTotal(),
      status: "draft",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes,
    };

    onInvoiceDraft(invoice);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] rounded-2xl border-0 shadow-2xl bg-white p-0">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-slate-50/50 flex-shrink-0">
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-slate-800">
                  Create Invoice
                </h2>
                <p className="text-sm text-slate-500">
                  {job.customer} • {job.vehicle}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Customer & Vehicle Info */}
              <div className="space-y-6">
                <Card className="border border-slate-200/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4 text-blue-500" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {job.customer}
                      </p>
                      <p className="text-xs text-slate-500">{job.customerEmail}</p>
                      <p className="text-xs text-slate-500">{job.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Car className="h-4 w-4 text-blue-500" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {job.vehicle}
                      </p>
                      {job.registration && (
                        <p className="text-xs text-slate-500">
                          Rego: {job.registration}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Totals */}
                <Card className="border border-blue-200/60 bg-blue-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calculator className="h-4 w-4 text-blue-500" />
                      Invoice Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Subtotal:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(calculateSubtotal())}
                      </span>
                    </div>
                    {includeGst && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">
                          GST ({gstRate}%):
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(calculateGst())}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-3">
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

              {/* Right Column - Line Items */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-slate-200/60">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Service Line Items</CardTitle>
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
                        className="p-4 border border-slate-200 rounded-xl space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">
                                  Description
                                </label>
                                <Input
                                  value={item.description}
                                  onChange={(e) =>
                                    updateLineItem(item.id, "description", e.target.value)
                                  }
                                  placeholder="Service description"
                                  className="h-9"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    Qty
                                  </label>
                                  <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateLineItem(
                                        item.id,
                                        "quantity",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="h-9"
                                    min="1"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    Price
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
                                    className="h-9"
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    Total
                                  </label>
                                  <div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-md flex items-center text-sm font-medium text-slate-700">
                                    {formatCurrency(item.total)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-xs font-medium text-slate-600 mb-1 block">
                                Notes (optional)
                              </label>
                              <Textarea
                                value={item.notes || ""}
                                onChange={(e) =>
                                  updateLineItem(item.id, "notes", e.target.value)
                                }
                                placeholder="Additional notes for this item"
                                className="h-16 resize-none"
                              />
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
                        
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              item.type === "labor"
                                ? "bg-blue-100 text-blue-700"
                                : item.type === "parts"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {item.type === "labor"
                              ? "Labor"
                              : item.type === "parts"
                              ? "Parts"
                              : "Additional"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Invoice Notes */}
                <Card className="border border-slate-200/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Invoice Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes or terms for this invoice..."
                      className="h-20 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Invoice will be sent to: <span className="font-medium">{job.customer}</span>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  className="bg-white hover:bg-slate-50"
                  disabled={isProcessing}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSendInvoice}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 min-w-[180px]"
                  disabled={isProcessing || lineItems.some(item => !item.description.trim())}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Final Invoice
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}