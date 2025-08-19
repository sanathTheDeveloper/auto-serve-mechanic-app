"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BaseModal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalActions,
  ModalActionGroup,
} from "@/components/ui/modal";
import {
  User,
  Wrench,
  DollarSign,
  Info,
  History,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  PlayCircle,
  MessageSquare,
  CheckCircle,
  FileText,
  Car,
} from "lucide-react";
import { Job } from "@/types/booking";
import { statusConfig } from "@/data/jobs";

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onStartJob?: (job: Job) => void;
  onCreateQuote?: (job: Job) => void;
  onCompleteJob?: (job: Job) => void;
}

type DetailTab = "details" | "history" | "customer";

export function BookingDetailsDialog({
  open,
  onOpenChange,
  job,
  onStartJob,
  onCreateQuote,
  onCompleteJob,
}: BookingDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("details");

  if (!job) return null;

  const handleStartJob = () => {
    if (onStartJob) {
      onStartJob(job);
      onOpenChange(false);
    }
  };

  const handleCreateQuote = () => {
    if (onCreateQuote) {
      onCreateQuote(job);
    }
  };

  const handleCompleteJob = () => {
    if (onCompleteJob) {
      onCompleteJob(job);
      onOpenChange(false);
    }
  };

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} size="xl">
      <ModalHeader
        icon={User}
        title={job.customer}
        subtitle={`${job.vehicle} • ${job.service}`}
        variant="blue"
      />

      <ModalContent>
        {/* Modern Tab Navigation */}
        <div className="px-6 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="grid grid-cols-3 bg-slate-50 rounded-xl p-1 h-11">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
                activeTab === "details"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Info className="h-4 w-4" />
              Job Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
                activeTab === "history"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <History className="h-4 w-4" />
              Vehicle History
            </button>
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
                activeTab === "customer"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <User className="h-4 w-4" />
              Customer Info
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth">
          {activeTab === "details" && (
            <div className="px-6 py-4 space-y-4">
              {/* Status and Schedule */}
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Status</p>
                      <Badge className={statusConfig.jobStage[job.stage].className}>
                        {statusConfig.jobStage[job.stage].label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Priority</p>
                      <div className="flex items-center gap-1">
                        {job.priority === "urgent" && (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            job.priority === "urgent"
                              ? "text-amber-600"
                              : "text-slate-600"
                          }`}
                        >
                          {job.priority === "urgent" ? "URGENT" : "Normal"}
                        </span>
                      </div>
                    </div>
                    {job.timeStart && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            Scheduled Time
                          </p>
                          <p className="text-sm text-slate-700">
                            {job.timeStart} - {job.timeEnd}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            Service Bay
                          </p>
                          <p className="text-sm text-slate-700">{job.bay}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card className="rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Primary Service
                      </p>
                      <p className="text-base font-semibold text-slate-800">
                        {job.service}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Estimated Duration
                      </p>
                      <p className="text-base text-slate-700">{job.duration}</p>
                    </div>
                  </div>

                  {job.description && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Customer Request
                      </p>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-sm text-amber-800 italic">
                          &ldquo;{job.description}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              {job.finalPrice && (
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Labor</span>
                        <span className="font-medium">
                          ${Math.round(job.finalPrice * 0.7)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Parts</span>
                        <span className="font-medium">
                          ${Math.round(job.finalPrice * 0.2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Tax</span>
                        <span className="font-medium">
                          ${Math.round(job.finalPrice * 0.1)}
                        </span>
                      </div>
                      <hr className="border-slate-200" />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">Total</span>
                        <span className="text-xl font-bold text-green-600">
                          ${job.finalPrice}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="px-6 py-4 space-y-4">
              <Card className="rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-500" />
                    Vehicle Service History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-200 pl-4">
                      <p className="font-medium text-slate-800">Oil Change</p>
                      <p className="text-sm text-slate-600">March 15, 2024</p>
                      <p className="text-xs text-slate-500">45,200 km</p>
                    </div>
                    <div className="border-l-2 border-blue-200 pl-4">
                      <p className="font-medium text-slate-800">Brake Inspection</p>
                      <p className="text-sm text-slate-600">January 22, 2024</p>
                      <p className="text-xs text-slate-500">43,800 km</p>
                    </div>
                    <div className="border-l-2 border-slate-200 pl-4">
                      <p className="font-medium text-slate-500">Tire Rotation</p>
                      <p className="text-sm text-slate-500">December 10, 2023</p>
                      <p className="text-xs text-slate-400">42,100 km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "customer" && (
            <div className="px-6 py-4 space-y-4">
              <Card className="rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Full Name
                      </p>
                      <p className="text-base text-slate-800">{job.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <p className="text-base text-slate-800">{job.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Email Address
                      </p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <p className="text-base text-slate-800">
                          {job.customer.toLowerCase().replace(' ', '.')}@email.com
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Address
                      </p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <p className="text-base text-slate-800">
                          123 Main St, Brisbane QLD
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-500" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Vehicle
                      </p>
                      <p className="text-base font-semibold text-slate-800">
                        {job.vehicle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Registration
                      </p>
                      <p className="text-base text-slate-800">ABC123</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        VIN
                      </p>
                      <p className="text-base text-slate-800">
                        1HGBH41JXMN109186
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Mileage
                      </p>
                      <p className="text-base text-slate-800">45,200 km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter>
        <ModalActions>
          <ModalActionGroup>
            <Button
              variant="outline"
              className="flex-1 rounded-lg border-slate-200 text-slate-600 hover:bg-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </ModalActionGroup>

          <ModalActionGroup>
            {job.stage === "quote-requested" && (
              <Button
                onClick={handleCreateQuote}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
            )}
            {job.stage === "confirmed" && (
              <Button
                onClick={handleStartJob}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Job
              </Button>
            )}
            {job.stage === "in-progress" && (
              <Button
                onClick={handleCompleteJob}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Job
              </Button>
            )}
          </ModalActionGroup>
        </ModalActions>
      </ModalFooter>
    </BaseModal>
  );
}