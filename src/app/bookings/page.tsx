"use client";

import { useState, useMemo } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  List,
  CalendarDays,
  Search,
  Phone,
  MessageSquare,
  Eye,
  RotateCcw,
  PlayCircle,
  XCircle,
  Clock,
  User,
  Car,
  Wrench,
  FileText,
  CheckCircle,
  AlertCircle,
  Send,
  X,
} from "lucide-react";
import { mockJobs, statusConfig } from "@/data/jobs";
import { Job } from "@/types/booking";

type ViewMode = "list" | "calendar";
type TabValue = "quotes" | "upcoming" | "progress" | "completed";

export default function BookingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<TabValue>("quotes");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  // Modal states
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedJobForQuote, setSelectedJobForQuote] = useState<Job | null>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    labor: "",
    parts: "",
    timeframe: "",
    notes: "",
  });

  // Filter jobs based on tab and filters
  const filteredJobs = useMemo(() => {
    let jobs = mockJobs;

    // Filter by tab
    switch (activeTab) {
      case "quotes":
        jobs = jobs.filter(job => job.stage === "quote-requested" || job.stage === "quote-sent");
        break;
      case "upcoming":
        jobs = jobs.filter(job => job.stage === "confirmed");
        break;
      case "progress":
        jobs = jobs.filter(job => job.stage === "in-progress");
        break;
      case "completed":
        jobs = jobs.filter(job => job.stage === "completed");
        break;
    }

    // Apply search filter
    if (searchTerm) {
      jobs = jobs.filter(job => 
        job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      jobs = jobs.filter(job => job.stage === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      jobs = jobs.filter(job => job.priority === priorityFilter);
    }

    // Apply date filter if selected
    if (selectedDate) {
      jobs = jobs.filter(job => isSameDay(parseISO(job.date), selectedDate));
    }

    return jobs;
  }, [activeTab, searchTerm, statusFilter, priorityFilter, selectedDate]);

  // Get jobs count for each tab
  const getTabCounts = () => {
    return {
      quotes: mockJobs.filter(job => job.stage === "quote-requested" || job.stage === "quote-sent").length,
      upcoming: mockJobs.filter(job => job.stage === "confirmed").length,
      progress: mockJobs.filter(job => job.stage === "in-progress").length,
      completed: mockJobs.filter(job => job.stage === "completed").length,
    };
  };

  const tabCounts = getTabCounts();

  // Handle quote submission
  const handleSendQuote = () => {
    if (selectedJobForQuote) {
      console.log("Sending quote for job:", selectedJobForQuote.id, quoteForm);
      setQuoteModalOpen(false);
      setQuoteForm({ labor: "", parts: "", timeframe: "", notes: "" });
      setSelectedJobForQuote(null);
    }
  };

  // Handle job actions
  const handleCallClient = (job: Job) => {
    window.open(`tel:${job.phone}`);
  };

  const handleContactCustomer = (job: Job) => {
    console.log("Opening chat with:", job.customer);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleReschedule = (job: Job) => {
    console.log("Reschedule job:", job.id);
  };

  const handleMarkInProgress = (job: Job) => {
    console.log("Mark as in progress:", job.id);
  };

  const handleCancelBooking = (job: Job) => {
    console.log("Cancel booking:", job.id);
  };

  const handleRequestMoreInfo = (job: Job) => {
    console.log("Request more info for:", job.id);
  };

  const handleDeclineQuote = (job: Job) => {
    console.log("Decline quote for:", job.id);
  };

  // Render job card
  const renderJobCard = (job: Job) => {
    const isQuoteStage = job.stage === "quote-requested" || job.stage === "quote-sent";
    
    return (
      <Card key={job.id} className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{job.customer}</h3>
                  <p className="text-sm text-slate-600">{job.phone}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700">{job.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700">{job.service}</span>
                </div>
                {job.timeStart && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-700">{job.timeStart} - {job.timeEnd}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={statusConfig.jobStage[job.stage].className}>
                  {statusConfig.jobStage[job.stage].label}
                </Badge>
                <Badge className={statusConfig.paymentStatus[job.paymentStatus].className}>
                  {statusConfig.paymentStatus[job.paymentStatus].label}
                </Badge>
                {job.priority === "urgent" && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Urgent
                  </Badge>
                )}
              </div>

              {job.description && (
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">
                  {job.description}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {isQuoteStage ? (
              <>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSelectedJobForQuote(job);
                    setQuoteModalOpen(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Send Quote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRequestMoreInfo(job)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Info
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDeclineQuote(job)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCallClient(job)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Client
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleContactCustomer(job)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(job)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </Button>
                {job.stage === "confirmed" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReschedule(job)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleMarkInProgress(job)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Job
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleCancelBooking(job)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking & Quote Management</h1>
          <p className="text-slate-600">Manage your entire service workflow from quote to completion</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* View mode toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search customers, vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Date picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Status filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="quote-requested">Quote Requested</SelectItem>
                  <SelectItem value="quote-sent">Quote Sent</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority filter */}
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear filters */}
              {(searchTerm || selectedDate || statusFilter !== "all" || priorityFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDate(undefined);
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        {viewMode === "list" ? (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
              <TabsTrigger value="quotes" className="relative">
                New Quotes
                {tabCounts.quotes > 0 && (
                  <Badge className="ml-2 bg-amber-500 text-white text-xs px-2 py-1">
                    {tabCounts.quotes}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="relative">
                Upcoming Bookings
                {tabCounts.upcoming > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white text-xs px-2 py-1">
                    {tabCounts.upcoming}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="progress" className="relative">
                Jobs in Progress
                {tabCounts.progress > 0 && (
                  <Badge className="ml-2 bg-purple-500 text-white text-xs px-2 py-1">
                    {tabCounts.progress}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="relative">
                Completed Jobs
                {tabCounts.completed > 0 && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs px-2 py-1">
                    {tabCounts.completed}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="quotes" className="mt-0">
                <div className="grid gap-4">
                  {filteredJobs.length === 0 ? (
                    <Card className="bg-white border border-slate-200">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-center">No quote requests found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredJobs.map(renderJobCard)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-0">
                <div className="grid gap-4">
                  {filteredJobs.length === 0 ? (
                    <Card className="bg-white border border-slate-200">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CalendarIcon className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-center">No upcoming bookings found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredJobs.map(renderJobCard)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="mt-0">
                <div className="grid gap-4">
                  {filteredJobs.length === 0 ? (
                    <Card className="bg-white border border-slate-200">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Wrench className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-center">No jobs in progress found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredJobs.map(renderJobCard)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="grid gap-4">
                  {filteredJobs.length === 0 ? (
                    <Card className="bg-white border border-slate-200">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-center">No completed jobs found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredJobs.map(renderJobCard)
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Calendar Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasJobs: (date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        return mockJobs.some(job => job.date === dateStr);
                      },
                      hasUrgent: (date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        return mockJobs.some(job => job.date === dateStr && job.priority === 'urgent');
                      },
                    }}
                    modifiersStyles={{
                      hasJobs: { 
                        backgroundColor: '#dbeafe',
                        color: '#1e40af'
                      },
                      hasUrgent: { 
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        fontWeight: 'bold'
                      },
                    }}
                  />
                  
                  {/* Legend */}
                  <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-100 rounded border"></div>
                      <span className="text-slate-600">Has bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-100 rounded border"></div>
                      <span className="text-slate-600">Urgent jobs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected day details */}
            <div>
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">
                    {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a Date"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="space-y-3">
                      {filteredJobs.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">
                          No jobs scheduled for this date
                        </p>
                      ) : (
                        filteredJobs.map((job) => (
                          <div
                            key={job.id}
                            className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => handleViewDetails(job)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-slate-800 text-sm">{job.customer}</p>
                                <p className="text-xs text-slate-600">{job.service}</p>
                              </div>
                              <Badge className={`text-xs ${statusConfig.jobStage[job.stage].className}`}>
                                {statusConfig.jobStage[job.stage].label}
                              </Badge>
                            </div>
                            {job.timeStart && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                {job.timeStart} - {job.timeEnd}
                              </div>
                            )}
                            {job.priority === "urgent" && (
                              <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                Urgent
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">
                      Click on a date to see scheduled jobs
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick stats for selected date */}
              {selectedDate && filteredJobs.length > 0 && (
                <Card className="bg-white border border-slate-200 mt-4">
                  <CardHeader>
                    <CardTitle className="text-base">Day Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-700">{filteredJobs.length}</div>
                        <div className="text-blue-600">Total Jobs</div>
                      </div>
                      <div className="text-center p-2 bg-amber-50 rounded">
                        <div className="font-semibold text-amber-700">
                          {filteredJobs.filter(j => j.priority === 'urgent').length}
                        </div>
                        <div className="text-amber-600">Urgent</div>
                      </div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded text-sm">
                      <div className="font-semibold text-green-700">
                        ${filteredJobs.reduce((sum, job) => sum + (job.finalPrice || 0), 0)}
                      </div>
                      <div className="text-green-600">Expected Revenue</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Quote Modal */}
        <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Create Quote</h2>
                  <p className="text-sm text-slate-500 font-normal">
                    {selectedJobForQuote?.customer} • {selectedJobForQuote?.vehicle}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedJobForQuote && (
              <div className="space-y-6">
                {/* Customer request */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Customer Request</h3>
                  <p className="text-sm text-slate-600">{selectedJobForQuote.description}</p>
                </div>

                {/* Quote form */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Labor Cost
                    </label>
                    <Input
                      placeholder="e.g., $150"
                      value={quoteForm.labor}
                      onChange={(e) => setQuoteForm({ ...quoteForm, labor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Parts Cost
                    </label>
                    <Input
                      placeholder="e.g., $200"
                      value={quoteForm.parts}
                      onChange={(e) => setQuoteForm({ ...quoteForm, parts: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Timeframe
                  </label>
                  <Input
                    placeholder="e.g., 2-3 hours"
                    value={quoteForm.timeframe}
                    onChange={(e) => setQuoteForm({ ...quoteForm, timeframe: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Notes
                  </label>
                  <Textarea
                    placeholder="Any additional information for the customer..."
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setQuoteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendQuote}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Quote
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Job Details Modal */}
        <Dialog open={jobDetailsOpen} onOpenChange={setJobDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedJob?.customer}</h2>
                  <p className="text-sm text-slate-500 font-normal">
                    {selectedJob?.vehicle} • {selectedJob?.service}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedJob && (
              <div className="space-y-6">
                {/* Status and basic info */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Badge className={statusConfig.jobStage[selectedJob.stage].className}>
                          {statusConfig.jobStage[selectedJob.stage].label}
                        </Badge>
                        <p className="text-sm text-slate-600 mt-2">Status</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Badge className={statusConfig.paymentStatus[selectedJob.paymentStatus].className}>
                          {statusConfig.paymentStatus[selectedJob.paymentStatus].label}
                        </Badge>
                        <p className="text-sm text-slate-600 mt-2">Payment</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <span className="text-lg font-semibold text-slate-800">
                          {selectedJob.finalPrice ? `$${selectedJob.finalPrice}` : "TBD"}
                        </span>
                        <p className="text-sm text-slate-600 mt-2">Price</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Phone</p>
                        <p className="text-sm text-slate-600">{selectedJob.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Email</p>
                        <p className="text-sm text-slate-600">{selectedJob.customerEmail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Service</p>
                      <p className="text-sm text-slate-600">{selectedJob.service}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Description</p>
                      <p className="text-sm text-slate-600">{selectedJob.description}</p>
                    </div>
                    {selectedJob.notes && (
                      <div>
                        <p className="text-sm font-medium text-slate-700">Notes</p>
                        <p className="text-sm text-slate-600">{selectedJob.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}