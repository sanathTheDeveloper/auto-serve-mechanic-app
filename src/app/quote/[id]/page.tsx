"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Plus,
  Phone,
  Send,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { mockJobs } from "@/data/jobs";
import { Job } from "@/types/booking";

export default function QuotePage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [laborItems, setLaborItems] = useState([
    { id: 1, description: "", notes: "", quantity: 1, rate: 0, total: 0 },
  ]);
  const [partsItems, setPartsItems] = useState([
    { id: 1, description: "", partNumber: "", quantity: 1, cost: 0, total: 0 },
  ]);
  
  // Decline job dialog state
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineNotes, setDeclineNotes] = useState("");

  useEffect(() => {
    const jobId = params.id as string;
    const foundJob = mockJobs.find((j) => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
      // Initialize with job service
      setLaborItems([
        {
          id: 1,
          description: foundJob.service,
          notes: "",
          quantity: 1,
          rate: 150,
          total: 150,
        },
      ]);
    }
  }, [params.id]);

  const handleContactCustomer = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  // const handleMessageCustomer = () => {
  //   console.log(`Opening message interface for ${job?.customer}`);
  // };

  const handleDeclineJob = () => {
    setDeclineDialogOpen(true);
  };

  const handleConfirmDecline = () => {
    if (!declineReason) {
      alert("Please select a reason for declining this job.");
      return;
    }
    
    console.log(`Declining job: ${job?.id}`, {
      reason: declineReason,
      notes: declineNotes,
      customer: job?.customer,
      vehicle: job?.vehicle,
      service: job?.service
    });
    
    // Here you would typically make an API call to update the job status
    // and send notification to customer
    
    setDeclineDialogOpen(false);
    router.push("/dashboard");
  };

  const handleCancelDecline = () => {
    setDeclineDialogOpen(false);
    setDeclineReason("");
    setDeclineNotes("");
  };

  const handleDownloadQuote = () => {
    if (!job) return;

    const laborTotal = laborItems.reduce((sum, item) => sum + item.total, 0);
    const partsTotal = partsItems.reduce((sum, item) => sum + item.total, 0);
    const subtotal = laborTotal + partsTotal;
    const gst = subtotal * 0.1;
    const total = subtotal + gst;

    const element = document.createElement("a");
    const fileContent = `
QUOTE - ${job.customer}
Vehicle: ${job.vehicle}
Service: ${job.service}
Date: ${job.date}

Labor & Services:
${laborItems
  .map((item) => `- ${item.description}: $${item.total.toFixed(2)}`)
  .join("\n")}

Parts & Materials:
${partsItems
  .map((item) => `- ${item.description}: $${item.total.toFixed(2)}`)
  .join("\n")}

Summary:
Labor Total: $${laborTotal.toFixed(2)}
Parts Total: $${partsTotal.toFixed(2)}
Subtotal: $${subtotal.toFixed(2)}
GST (10%): $${gst.toFixed(2)}
Total Quote: $${total.toFixed(2)}

Valid for 7 days
    `;
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `quote_${job.customer.replace(/\s+/g, "_")}_${
      job.id
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSendQuote = () => {
    console.log(`Sending quote for job: ${job?.id}`);
    router.push("/dashboard");
  };

  const addLaborItem = () => {
    const newId = Math.max(...laborItems.map((item) => item.id)) + 1;
    setLaborItems([
      ...laborItems,
      {
        id: newId,
        description: "",
        notes: "",
        quantity: 1,
        rate: 0,
        total: 0,
      },
    ]);
  };

  const addPartsItem = () => {
    const newId = Math.max(...partsItems.map((item) => item.id)) + 1;
    setPartsItems([
      ...partsItems,
      {
        id: newId,
        description: "",
        partNumber: "",
        quantity: 1,
        cost: 0,
        total: 0,
      },
    ]);
  };

  const updateLaborItem = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setLaborItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.total = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const updatePartsItem = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setPartsItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "cost") {
            updated.total = updated.quantity * updated.cost;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removeLaborItem = (id: number) => {
    if (laborItems.length > 1) {
      setLaborItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const removePartsItem = (id: number) => {
    if (partsItems.length > 1) {
      setPartsItems((items) => items.filter((item) => item.id !== id));
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  const laborTotal = laborItems.reduce((sum, item) => sum + item.total, 0);
  const partsTotal = partsItems.reduce((sum, item) => sum + item.total, 0);
  const subtotal = laborTotal + partsTotal;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

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
                  {job.stage === "quote-requested"
                    ? "Create Quote"
                    : "Update Quote"}
                </h1>
                <p className="text-sm text-slate-600">
                  {job.customer} • {job.vehicle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">

        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 border border-orange-200/60 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1 uppercase tracking-wide">
                    Customer
                  </p>
                  <p className="font-semibold text-slate-800 text-base">
                    {job.customer}
                  </p>
                  <p className="text-slate-600">{job.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1 uppercase tracking-wide">
                    Vehicle
                  </p>
                  <p className="font-semibold text-slate-800 text-base">
                    {job.vehicle}
                  </p>
                  <p className="text-slate-600">{job.service}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1 uppercase tracking-wide">
                    Request Date
                  </p>
                  <p className="font-semibold text-slate-800 text-base">
                    {job.date}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 mt-1">
                    {job.priority === "urgent" ? "URGENT" : "Normal Priority"}
                  </Badge>
                </div>
              </div>

              {job.description && (
                <div className="mt-6 pt-6 border-t border-orange-200/60">
                  <p className="text-xs font-medium text-orange-700 mb-2 uppercase tracking-wide">
                    Customer Request
                  </p>
                  <div className="bg-white/60 p-4 rounded-xl border border-orange-200/40">
                    <p className="text-sm text-slate-700 italic">
                      &ldquo;{job.description}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote Line Items */}
          <Card className="rounded-xl shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="h-6 w-6 text-blue-500" />
                Quote Line Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Labor & Services Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-medium text-slate-700 text-base">
                    Labor & Services
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addLaborItem}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  {laborItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start p-4 bg-slate-50/50 rounded-lg"
                    >
                      <div className="col-span-1 lg:col-span-5">
                        <Input
                          placeholder="Service description"
                          value={item.description}
                          onChange={(e) =>
                            updateLaborItem(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="font-medium"
                        />
                        <textarea
                          placeholder="Additional notes..."
                          value={item.notes}
                          onChange={(e) =>
                            updateLaborItem(item.id, "notes", e.target.value)
                          }
                          className="w-full mt-3 text-sm text-slate-500 bg-white border border-slate-200 rounded-md p-3 resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="col-span-6 lg:col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLaborItem(
                              item.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="text-center"
                          min="1"
                        />
                        <p className="text-xs text-slate-500 text-center mt-2">
                          Quantity
                        </p>
                      </div>
                      <div className="col-span-6 lg:col-span-2">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateLaborItem(
                              item.id,
                              "rate",
                              Number(e.target.value)
                            )
                          }
                          className="text-right"
                          step="0.01"
                        />
                        <p className="text-xs text-slate-500 text-center mt-2">
                          Rate
                        </p>
                      </div>
                      <div className="col-span-10 lg:col-span-2 text-right">
                        <span className="text-lg font-semibold text-slate-800">
                          ${item.total.toFixed(2)}
                        </span>
                        <p className="text-xs text-slate-500 mt-2">Total</p>
                      </div>
                      <div className="col-span-2 lg:col-span-1 flex justify-center">
                        {laborItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLaborItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parts & Materials Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-medium text-slate-700 text-base">
                    Parts & Materials
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addPartsItem}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  {partsItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start p-4 bg-blue-50/30 rounded-lg"
                    >
                      <div className="col-span-1 lg:col-span-5">
                        <Input
                          placeholder="Part description"
                          value={item.description}
                          onChange={(e) =>
                            updatePartsItem(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="font-medium"
                        />
                        <Input
                          placeholder="Part number or supplier code..."
                          value={item.partNumber}
                          onChange={(e) =>
                            updatePartsItem(
                              item.id,
                              "partNumber",
                              e.target.value
                            )
                          }
                          className="mt-3 text-sm"
                        />
                      </div>
                      <div className="col-span-6 lg:col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updatePartsItem(
                              item.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="text-center"
                          min="1"
                        />
                        <p className="text-xs text-slate-500 text-center mt-2">
                          Quantity
                        </p>
                      </div>
                      <div className="col-span-6 lg:col-span-2">
                        <Input
                          type="number"
                          value={item.cost}
                          onChange={(e) =>
                            updatePartsItem(
                              item.id,
                              "cost",
                              Number(e.target.value)
                            )
                          }
                          className="text-right"
                          step="0.01"
                        />
                        <p className="text-xs text-slate-500 text-center mt-2">
                          Cost
                        </p>
                      </div>
                      <div className="col-span-10 lg:col-span-2 text-right">
                        <span className="text-lg font-semibold text-slate-800">
                          ${item.total.toFixed(2)}
                        </span>
                        <p className="text-xs text-slate-500 mt-2">Total</p>
                      </div>
                      <div className="col-span-2 lg:col-span-1 flex justify-center">
                        {partsItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePartsItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Summary */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Line Items */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-700 mb-4 text-base">
                        Quote Breakdown
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Labor Total</span>
                        <span className="font-medium">
                          ${laborTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Parts Total</span>
                        <span className="font-medium">
                          ${partsTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">GST (10%)</span>
                        <span className="font-medium">${gst.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Right Column - Total & Terms */}
                    <div className="flex flex-col justify-center items-end text-right">
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-2">
                          Total Quote
                        </p>
                        <p className="text-4xl font-bold text-green-600">
                          ${total.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-700 mt-2">
                          Valid for 7 days
                        </p>
                      </div>

                      <div className="text-xs text-slate-500 space-y-1">
                        <p>• Quote includes labor and materials</p>
                        <p>• Additional charges may apply for extra work</p>
                        <p>• Payment due upon completion</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                {/* Communication Actions */}
                <div className="flex gap-3 flex-1">
                  <Button
                    variant="outline"
                    onClick={() => handleContactCustomer(job.phone)}
                    className="flex-1 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Client
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeclineJob}
                    className="flex-1 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  >
                    Decline Job
                  </Button>
                </div>

                {/* Primary Actions */}
                <div className="flex gap-3 flex-1">
                  <Button
                    onClick={handleDownloadQuote}
                    variant="outline"
                    className="flex-1 rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleSendQuote}
                    className="flex-[2] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Quote to Customer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Decline Job Dialog */}
        <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Decline Job</h2>
                  <p className="text-sm text-slate-500 font-normal">
                    {job?.customer} • {job?.vehicle}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800 mb-1">Important Notice</h3>
                    <p className="text-sm text-amber-700">
                      Declining this job will notify the customer and remove it from your active queue. 
                      Please provide a clear reason to maintain good customer relations.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Declining *
                </label>
                <Select value={declineReason} onValueChange={setDeclineReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fully-booked">Workshop Fully Booked</SelectItem>
                    <SelectItem value="outside-expertise">Outside Our Expertise</SelectItem>
                    <SelectItem value="parts-unavailable">Required Parts Unavailable</SelectItem>
                    <SelectItem value="scheduling-conflict">Scheduling Conflict</SelectItem>
                    <SelectItem value="customer-location">Customer Location Too Far</SelectItem>
                    <SelectItem value="safety-concerns">Safety Concerns</SelectItem>
                    <SelectItem value="insufficient-information">Insufficient Job Information</SelectItem>
                    <SelectItem value="other">Other (Specify Below)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes <span className="text-slate-500">(Optional)</span>
                </label>
                <Textarea
                  placeholder="Provide additional context or suggest alternative solutions..."
                  value={declineNotes}
                  onChange={(e) => setDeclineNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  This message will be included in the notification sent to the customer.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={handleCancelDecline}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDecline}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!declineReason}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Confirm Decline
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
