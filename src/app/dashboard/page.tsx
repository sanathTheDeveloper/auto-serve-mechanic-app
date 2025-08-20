"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  isSameDay,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Home,
  Calendar,
  Wrench,
  CreditCard,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Bell,
  Clock,
  Users,
  Car,
  DollarSign,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  Timer,
  MapPin,
  Calendar as CalendarIcon,
  List,
  CalendarDays,
  RefreshCw,
  MessageSquare,
  PlayCircle,
  User,
  Mail,
  History,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ServiceMenuManager } from "@/components/ServiceMenuManager";
import { InvoicingPage } from "@/components/invoicing/InvoicingPage";
import { mockJobs, statusConfig, getJobsByStage } from "@/data/jobs";
import { Job, JobFilter } from "@/types/booking";
import { Logo } from "@/components/Logo";

// Calculate dynamic badge counts
const getNavigationItems = () => {
  const urgentJobsCount = mockJobs.filter(
    (job) =>
      job.priority === "urgent" &&
      (job.stage === "quote-requested" ||
        job.stage === "confirmed" ||
        job.stage === "in-progress")
  ).length;

  return [
    { id: "overview", icon: Home, label: "Overview" },
    {
      id: "bookings",
      icon: Calendar,
      label: "Bookings",
      badge: urgentJobsCount > 0 ? urgentJobsCount.toString() : undefined,
    },
    { id: "services", icon: Wrench, label: "Service Menu" },
    { id: "payments", icon: CreditCard, label: "Invoicing" },
    { id: "reviews", icon: Star, label: "Reviews", badge: "3" },
    { id: "settings", icon: Settings, label: "Shop Profile" },
  ];
};

const quickStats = [
  {
    label: "Today&apos;s Revenue",
    value: "$1,250",
    icon: DollarSign,
    change: "+12%",
    positive: true,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Active Bookings",
    value: "8",
    icon: Calendar,
    change: "2 urgent",
    positive: false,
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Queue Time",
    value: "45min",
    icon: Clock,
    change: "Bay 3 busy",
    positive: true,
    color: "from-blue-400 to-blue-500",
  },
  {
    label: "Weekly Customers",
    value: "24",
    icon: Users,
    change: "+3 today",
    positive: true,
    color: "from-slate-600 to-slate-700",
  },
];

// Get today's bookings from the new job system
const getTodaysBookings = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  return mockJobs.filter((job) => job.date === today);
};

export default function DashboardSPA() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Booking management state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStageTab, setActiveStageTab] = useState<string>("quotes");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [filters, setFilters] = useState<JobFilter>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<
    "details" | "history" | "customer"
  >("details");

  // Booking management computed values (must be before early returns)
  const filteredJobs = useMemo(() => {
    let filtered = mockJobs;

    // Filter by active stage tab
    switch (activeStageTab) {
      case "quotes":
        filtered = filtered.filter(
          (job) => job.stage === "quote-requested" || job.stage === "quote-sent"
        );
        break;
      case "upcoming":
        filtered = filtered.filter((job) => job.stage === "confirmed");
        break;
      case "progress":
        filtered = filtered.filter((job) => job.stage === "in-progress");
        break;
      case "completed":
        filtered = filtered.filter((job) => job.stage === "completed");
        break;
    }

    // Apply additional filters
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.customer.toLowerCase().includes(searchLower) ||
          job.vehicle.toLowerCase().includes(searchLower) ||
          job.service.toLowerCase().includes(searchLower)
      );
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((job) =>
        filters.priority!.includes(job.priority)
      );
    }

    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      filtered = filtered.filter((job) =>
        filters.paymentStatus!.includes(job.paymentStatus)
      );
    }

    if (filters.dateRange) {
      filtered = filtered.filter((job) => {
        const jobDate = parseISO(job.date);
        return isWithinInterval(jobDate, {
          start: startOfDay(filters.dateRange!.from),
          end: endOfDay(filters.dateRange!.to),
        });
      });
    }

    return filtered.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      return (a.timeStart || "").localeCompare(b.timeStart || "");
    });
  }, [filters, activeStageTab]);

  // Get jobs for selected date (calendar view)
  const selectedDateJobs = useMemo(() => {
    return filteredJobs.filter((job) =>
      isSameDay(parseISO(job.date), selectedDate)
    );
  }, [filteredJobs, selectedDate]);

  // Get job counts by date for calendar
  const jobCountsByDate = useMemo(() => {
    const counts: Record<
      string,
      { total: number; byStage: Record<string, number> }
    > = {};
    mockJobs.forEach((job) => {
      if (!counts[job.date]) {
        counts[job.date] = { total: 0, byStage: {} };
      }
      counts[job.date].total++;
      counts[job.date].byStage[job.stage] =
        (counts[job.date].byStage[job.stage] || 0) + 1;
    });
    return counts;
  }, []);

  // Get tab counts
  const tabCounts = useMemo(() => {
    return {
      quotes:
        getJobsByStage("quote-requested").length +
        getJobsByStage("quote-sent").length,
      upcoming: getJobsByStage("confirmed").length,
      progress: getJobsByStage("in-progress").length,
      completed: getJobsByStage("completed").length,
    };
  }, []);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    // Redirect to shop profile if profile not completed
    if (user && (!user.hasCompletedProfile || user.isNewUser)) {
      router.push("/shop-profile");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Show loading if not authenticated or user data not available
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const handleContactCustomer = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  // Booking action handlers
  const handleMessageCustomer = (job: Job) => {
    console.log(`Opening message interface for ${job.customer}`);
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setBookingDetailsOpen(true);
    setActiveDetailTab("details");
  };

  const handleCreateQuote = (job: Job) => {
    router.push(`/quote/${job.id}`);
  };

  const handleMarkInProgress = (jobId: string) => {
    console.log(`Marking job as in progress: ${jobId}`);
  };

  const handleMarkCompleted = (jobId: string) => {
    console.log(`Marking job as completed: ${jobId}`);
  };

  // Render job card for booking management
  const renderActionableBookingCard = (job: Job) => {
    const stageConfig = statusConfig.jobStage[job.stage];
    const paymentConfig = statusConfig.paymentStatus[job.paymentStatus];

    const isQuoteStage =
      job.stage === "quote-requested" || job.stage === "quote-sent";
    const isUpcoming = job.stage === "confirmed";
    const isInProgress = job.stage === "in-progress";
    const isCompleted = job.stage === "completed";

    return (
      <Card
        key={job.id}
        className="bg-white/95 backdrop-blur-sm shadow-md border border-slate-200/60 hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 group cursor-pointer"
        onClick={() => handleViewJobDetails(job)}
      >
        <CardContent className="p-5">
          {/* Header: Time/Status and Priority */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {job.timeStart ? (
                <div className="text-center min-w-[70px]">
                  <div className="text-lg font-bold text-slate-800">
                    {job.timeStart}
                  </div>
                  <div className="text-xs text-slate-500">{job.bay}</div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              )}

              <div className="border-l border-slate-200 pl-3 flex-1">
                <Badge
                  className={`${stageConfig.className} text-xs font-medium mb-1`}
                  variant="secondary"
                >
                  {stageConfig.label}
                </Badge>
                {job.priority === "urgent" && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs font-medium">URGENT</span>
                  </div>
                )}
              </div>
            </div>

            {job.finalPrice && (
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ${job.finalPrice}
                </div>
                <Badge
                  className={`${paymentConfig.className} text-xs`}
                  variant="outline"
                >
                  {paymentConfig.label}
                </Badge>
              </div>
            )}
          </div>

          {/* Customer and Vehicle Info */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {job.customer}
            </h3>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                <span>{job.vehicle}</span>
              </div>
              <div className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                <span className="font-medium">{job.service}</span>
              </div>
            </div>
          </div>

          {/* Customer Request for Quotes */}
          {isQuoteStage && job.description && (
            <div className="mb-4 p-3 bg-amber-50/80 rounded-lg border border-amber-200/50">
              <p className="text-xs text-amber-700 font-medium mb-1">
                CUSTOMER REQUEST:
              </p>
              <p className="text-sm text-amber-800 italic">
                &ldquo;{job.description}&rdquo;
              </p>
            </div>
          )}

          {/* Progress Info */}
          {isInProgress && job.actualStartTime && (
            <div className="mb-4 p-3 bg-purple-50/80 rounded-lg border border-purple-200/50">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700 font-medium">
                  Started: {job.actualStartTime}
                </span>
              </div>
              {job.estimatedCompletion && (
                <p className="text-xs text-purple-600 mt-1">
                  Est. completion: {job.estimatedCompletion}
                </p>
              )}
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContactCustomer(job.phone);
                }}
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 h-9"
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageCustomer(job);
                }}
                className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 h-9"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>

              {isQuoteStage && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateQuote(job);
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-9"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Quote
                </Button>
              )}

              {isUpcoming && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkInProgress(job.id);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white h-9"
                >
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Start
                </Button>
              )}

              {isInProgress && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkCompleted(job.id);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-9"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}

              {isCompleted && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Generate invoice for ${job.id}`);
                  }}
                  className="flex-1 border-green-200 text-green-600 hover:bg-green-50 h-9"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Invoice
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render calendar content for booking management
  const renderCalendarContent = () => (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Enhanced Calendar */}
      <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-2xl overflow-hidden lg:col-span-3">
        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-slate-50/80 border-b border-blue-100/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-800">
                  Interactive Job Calendar
                </span>
                <p className="text-sm text-slate-500 font-normal">
                  Manage your schedule
                </p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 text-xs bg-white/60 rounded-xl px-3 py-2 border border-blue-100/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-sm"></div>
                  <span className="font-medium text-slate-700">Quotes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
                  <span className="font-medium text-slate-700">Upcoming</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full shadow-sm"></div>
                  <span className="font-medium text-slate-700">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-sm"></div>
                  <span className="font-medium text-slate-700">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                // Auto-filter the current tab to show only jobs for this date
                setFilters((prev) => ({
                  ...prev,
                  dateRange: {
                    from: date,
                    to: date,
                  },
                }));
              }
            }}
            className="rounded-md border-0 w-full"
            components={{
              DayButton: ({ day, ...props }) => {
                const dayString = format(day.date, "yyyy-MM-dd");
                const dayJobs = jobCountsByDate[dayString];
                const isSelected =
                  selectedDate &&
                  format(selectedDate, "yyyy-MM-dd") === dayString;

                return (
                  <div className="relative group">
                    <Button
                      {...props}
                      className={`
                        w-full h-10 p-0 hover:bg-blue-100 transition-all duration-200
                        ${
                          isSelected
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : ""
                        }
                        ${dayJobs ? "font-semibold" : ""}
                      `}
                    />
                    {dayJobs && (
                      <>
                        <div className="absolute top-1 right-1 flex gap-0.5 pointer-events-none">
                          {dayJobs.byStage["quote-requested"] && (
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full border border-white shadow-sm" />
                          )}
                          {dayJobs.byStage["confirmed"] && (
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full border border-white shadow-sm" />
                          )}
                          {dayJobs.byStage["in-progress"] && (
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full border border-white shadow-sm" />
                          )}
                          {dayJobs.byStage["completed"] && (
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full border border-white shadow-sm" />
                          )}
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          {dayJobs.total} job{dayJobs.total !== 1 ? "s" : ""}{" "}
                          scheduled
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                        </div>
                      </>
                    )}
                  </div>
                );
              },
            }}
          />

          {/* Calendar Quick Stats */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2 bg-amber-50 rounded-lg">
                <div className="text-lg font-bold text-amber-600">
                  {Object.values(jobCountsByDate).reduce(
                    (sum, day) => sum + (day.byStage["quote-requested"] || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-amber-700">New Quotes</div>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {Object.values(jobCountsByDate).reduce(
                    (sum, day) => sum + (day.byStage["confirmed"] || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-blue-700">Upcoming</div>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {Object.values(jobCountsByDate).reduce(
                    (sum, day) => sum + (day.byStage["in-progress"] || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-purple-700">In Progress</div>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {Object.values(jobCountsByDate).reduce(
                    (sum, day) => sum + (day.byStage["completed"] || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 border-b border-slate-100/50">
          <CardTitle className="text-base flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">
                {format(selectedDate, "d")}
              </span>
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-lg">
                {format(selectedDate, "MMM d")}
              </div>
              <div className="text-sm text-slate-500 font-normal">
                {format(selectedDate, "EEEE")}
              </div>
            </div>
          </CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            {selectedDateJobs.length} job
            {selectedDateJobs.length !== 1 ? "s" : ""} scheduled
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDateJobs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm">No jobs scheduled</p>
                <Button
                  size="sm"
                  className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Booking
                </Button>
              </div>
            ) : (
              selectedDateJobs
                .sort((a, b) =>
                  (a.timeStart || "").localeCompare(b.timeStart || "")
                )
                .map((job) => (
                  <div
                    key={job.id}
                    className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
                    onClick={() => handleViewJobDetails(job)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">
                          {job.timeStart || "No time"}
                        </span>
                        {job.priority === "urgent" && (
                          <AlertCircle className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                      <Badge
                        className={`${
                          statusConfig.jobStage[job.stage].className
                        } text-xs`}
                      >
                        {statusConfig.jobStage[job.stage].label}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      {job.customer}
                    </p>
                    <p className="text-xs text-slate-600 mb-2">{job.service}</p>

                    {/* Quick actions on hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactCustomer(job.phone);
                        }}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs border-slate-200 text-slate-600 hover:bg-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageCustomer(job);
                        }}
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Today's Summary */}
          {selectedDateJobs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">
                    {
                      selectedDateJobs.filter((j) => j.stage === "confirmed")
                        .length
                    }
                  </div>
                  <div className="text-blue-700">Ready</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-bold text-purple-600">
                    {
                      selectedDateJobs.filter((j) => j.stage === "in-progress")
                        .length
                    }
                  </div>
                  <div className="text-purple-700">Active</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSimpleBookingCard = (job: Job) => {
    const stageConfig = statusConfig.jobStage[job.stage];
    const isQuoteRequest =
      job.stage === "quote-requested" || job.stage === "quote-sent";

    return (
      <div
        key={job.id}
        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
          isQuoteRequest
            ? "bg-amber-50/50 border-amber-200/50 hover:bg-amber-100/50"
            : "bg-slate-50/50 border-slate-200/50 hover:bg-slate-100/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="text-center min-w-[60px]">
            {isQuoteRequest ? (
              <>
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mx-auto mb-1">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="text-xs font-medium text-amber-600">QUOTE</div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-slate-800">
                  {job.timeStart}
                </div>
                <div className="text-xs text-slate-500">{job.bay}</div>
              </>
            )}
          </div>
          <div className="border-l border-slate-300 pl-3">
            <div className="font-medium text-slate-800">{job.customer}</div>
            <div className="text-sm text-slate-600">{job.vehicle}</div>
            <div className="text-xs text-slate-500">{job.service}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`${stageConfig.className} text-xs`}
            variant="secondary"
          >
            {stageConfig.label}
          </Badge>
          {job.priority === "urgent" && (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case "overview":
        return (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
                      >
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          stat.positive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-600 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              {/* Today's Schedule - Enhanced with Actionable Cards */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Today&apos;s Schedule
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        {getTodaysBookings().length} bookings scheduled •{" "}
                        {
                          getTodaysBookings().filter(
                            (b) => b.priority === "urgent"
                          ).length
                        }{" "}
                        urgent
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage("bookings")}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Calendar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {getTodaysBookings().length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No bookings scheduled for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Quote Requests */}
                      {getTodaysBookings().filter(
                        (job) =>
                          job.stage === "quote-requested" ||
                          job.stage === "quote-sent"
                      ).length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-amber-500" />
                            <h4 className="text-sm font-medium text-amber-700">
                              Quote Requests
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {getTodaysBookings()
                              .filter(
                                (job) =>
                                  job.stage === "quote-requested" ||
                                  job.stage === "quote-sent"
                              )
                              .map((job) => renderSimpleBookingCard(job))}
                          </div>
                        </div>
                      )}

                      {/* Scheduled Appointments */}
                      {getTodaysBookings().filter(
                        (job) =>
                          job.stage !== "quote-requested" &&
                          job.stage !== "quote-sent"
                      ).length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <h4 className="text-sm font-medium text-slate-700">
                              Scheduled Appointments
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {getTodaysBookings()
                              .filter(
                                (job) =>
                                  job.stage !== "quote-requested" &&
                                  job.stage !== "quote-sent"
                              )
                              .sort((a, b) =>
                                (a.timeStart || "").localeCompare(
                                  b.timeStart || ""
                                )
                              )
                              .map((job) => renderSimpleBookingCard(job))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Simple Actions */}
                  {getTodaysBookings().length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          {getTodaysBookings().length} booking
                          {getTodaysBookings().length !== 1 ? "s" : ""} today
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage("bookings")}
                            className="text-xs"
                          >
                            Manage All
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions - Enhanced */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 h-fit">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white justify-start h-12">
                      <Plus className="h-4 w-4 mr-3" />
                      New Booking
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50"
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Create Invoice
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50"
                    >
                      <Car className="h-4 w-4 mr-3" />
                      Add Vehicle Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-slate-200 hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Shop Settings
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Service Capacity
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Bay 1</span>
                        <Badge className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Bay 2</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          In Use
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Bay 3</span>
                        <Badge className="bg-amber-100 text-amber-800">
                          Scheduled
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Summary */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Today&apos;s Performance
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Revenue</span>
                        <span className="font-semibold text-green-600">
                          $1,250
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Pending Invoices</span>
                        <span className="font-semibold text-amber-600">
                          $450
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          Services Completed
                        </span>
                        <span className="font-semibold text-blue-600">
                          {
                            getTodaysBookings().filter(
                              (j) => j.stage === "completed"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-6">
            {/* View Mode Toggle and Filters */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={
                        viewMode === "list"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "border-slate-200 text-slate-600"
                      }
                    >
                      <List className="h-4 w-4 mr-2" />
                      List View
                    </Button>
                    <Button
                      variant={viewMode === "calendar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("calendar")}
                      className={
                        viewMode === "calendar"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "border-slate-200 text-slate-600"
                      }
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Calendar View
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {(filters.searchTerm ||
                    filters.priority ||
                    filters.paymentStatus ||
                    filters.dateRange?.from) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({})}
                      className="text-slate-600"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Filters Row */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Search */}
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search by customer, vehicle, or service..."
                        value={filters.searchTerm || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            searchTerm: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="urgent"
                      checked={filters.priority?.includes("urgent") || false}
                      onCheckedChange={(checked) => {
                        const newPriority = checked
                          ? [...(filters.priority || []), "urgent" as const]
                          : (filters.priority || []).filter(
                              (p) => p !== "urgent"
                            );
                        setFilters((prev) => ({
                          ...prev,
                          priority:
                            newPriority.length > 0 ? newPriority : undefined,
                        }));
                      }}
                    />
                    <label
                      htmlFor="urgent"
                      className="text-sm text-orange-600 font-medium"
                    >
                      Urgent Only
                    </label>
                  </div>

                  {/* Date Range Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-56 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange?.from ? (
                          filters.dateRange.to ? (
                            <>
                              {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                              {format(filters.dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(filters.dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={
                          filters.dateRange
                            ? {
                                from: filters.dateRange.from,
                                to: filters.dateRange.to,
                              }
                            : undefined
                        }
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: { from: range.from!, to: range.to! },
                            }));
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: undefined,
                            }));
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            {viewMode === "calendar" ? (
              renderCalendarContent()
            ) : (
              /* Job Stage Tabs */
              <Tabs
                value={activeStageTab}
                onValueChange={setActiveStageTab}
                className="w-full"
              >
                <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg p-1 mb-6 w-full">
                  <TabsTrigger
                    value="quotes"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50/50 flex-1 gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>New Quotes</span>
                    {tabCounts.quotes > 0 && (
                      <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                        {tabCounts.quotes}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="upcoming"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 flex-1 gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Upcoming</span>
                    {tabCounts.upcoming > 0 && (
                      <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                        {tabCounts.upcoming}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="progress"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 flex-1 gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>In Progress</span>
                    {tabCounts.progress > 0 && (
                      <span className="ml-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                        {tabCounts.progress}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-green-600 hover:bg-green-50/50 flex-1 gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Completed</span>
                    {tabCounts.completed > 0 && (
                      <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                        {tabCounts.completed}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content */}
                <TabsContent value="quotes" className="space-y-4">
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Quote Requests ({filteredJobs.length})
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Customer requests requiring quotes or follow-up
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                          <div className="text-center py-12 text-slate-500">
                            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <p>No quote requests found</p>
                            <p className="text-sm">
                              New customer requests will appear here
                            </p>
                          </div>
                        ) : (
                          filteredJobs.map((job) =>
                            renderActionableBookingCard(job)
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Upcoming Bookings ({filteredJobs.length})
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Confirmed appointments ready to begin
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                          <div className="text-center py-12 text-slate-500">
                            <Clock className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <p>No upcoming bookings</p>
                            <p className="text-sm">
                              Confirmed appointments will appear here
                            </p>
                          </div>
                        ) : (
                          filteredJobs.map((job) =>
                            renderActionableBookingCard(job)
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-purple-500" />
                        Jobs in Progress ({filteredJobs.length})
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Active jobs currently being worked on
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                          <div className="text-center py-12 text-slate-500">
                            <PlayCircle className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <p>No jobs in progress</p>
                            <p className="text-sm">
                              Active work will appear here
                            </p>
                          </div>
                        ) : (
                          filteredJobs.map((job) =>
                            renderActionableBookingCard(job)
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        Completed Jobs ({filteredJobs.length})
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Finished jobs and service history
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                          <div className="text-center py-12 text-slate-500">
                            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <p>No completed jobs</p>
                            <p className="text-sm">
                              Finished work will appear here
                            </p>
                          </div>
                        ) : (
                          filteredJobs.map((job) =>
                            renderActionableBookingCard(job)
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        );

      case "services":
        return <ServiceMenuManager />;

      case "payments":
        return <InvoicingPage />;

      case "reviews":
        return (
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                    Review Response Tools
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Manage reputation with public review responses and customer
                    feedback
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Star className="h-4 w-4 mr-2" />
                  Respond to Reviews
                </Button>
              </div>
              <div className="text-center py-12 text-slate-500">
                <Star className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>Reply to public reviews to manage reputation</p>
                <p className="text-sm">Increase trust and quality control</p>
              </div>
            </CardContent>
          </Card>
        );

      case "settings":
        return (
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                    Shop Profile Setup
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Services offered, pricing, business hours, capacity, and
                    payment info
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="text-center py-12 text-slate-500">
                <Settings className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>Configure your shop profile and business settings</p>
                <p className="text-sm">
                  Manage hours, capacity, and service offerings
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return renderMainContent();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } transition-all duration-300 bg-white/95 backdrop-blur-sm border-r border-blue-200/50 shadow-xl flex flex-col relative`}
      >
        {/* Collapse/Expand Button - Positioned on the edge border */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-blue-200/50 rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 z-10 flex items-center justify-center p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-slate-600" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-slate-600" />
          )}
        </Button>

        {/* Header */}
        <div
          className={`${
            isCollapsed ? "p-3" : "px-4 py-3"
          } border-b border-blue-200/50`}
        >
          <div
            className={`${
              isCollapsed ? "flex items-center justify-center" : "flex items-center gap-3"
            }`}
          >
            <div
              className="cursor-pointer hover:scale-105 transition-all duration-200"
              onClick={() => router.push("/")}
            >
              <Logo size="sm" />
            </div>
            {!isCollapsed && (
              <div
                className="cursor-pointer"
                onClick={() => router.push("/")}
              >
                <p className="text-sm text-slate-600 font-medium">The Mechanic App</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gradient-to-r from-blue-50/50 to-orange-50/50 border border-blue-200/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={`flex-1 ${isCollapsed ? "px-3" : "p-4"}`}>
          <nav className={`space-y-3 ${isCollapsed ? "space-y-4" : ""}`}>
            {getNavigationItems().map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`group relative w-full flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } ${
                  isCollapsed ? "px-3 py-4" : "px-4 py-3"
                } rounded-xl text-left transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50"
                }`}
              >
                {/* Active indicator for collapsed state */}
                {isCollapsed && currentPage === item.id && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm" />
                )}

                <div
                  className={`relative ${
                    isCollapsed ? "flex flex-col items-center" : ""
                  }`}
                >
                  <item.icon
                    className={`${
                      isCollapsed ? "h-6 w-6 mb-1" : "h-5 w-5"
                    } flex-shrink-0 transition-all duration-200 group-hover:scale-110`}
                  />

                  {/* Badge for collapsed state */}
                  {isCollapsed && item.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                      {item.badge}
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          currentPage === item.id
                            ? "bg-white/20"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    {item.badge && ` (${item.badge})`}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer for collapsed state */}
        {isCollapsed && (
          <div className="p-4 border-t border-blue-200/50">
            <div className="flex justify-center">
              <div
                className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:scale-105"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.[0] || "U"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer for expanded state */}
        {!isCollapsed && (
          <div className="p-4 border-t border-blue-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.[0] || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {user?.shopName}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="w-full text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                {currentPage === "overview"
                  ? "Overview"
                  : currentPage === "services"
                  ? "Service Menu Customization"
                  : currentPage === "bookings"
                  ? "Bookings"
                  : currentPage === "payments"
                  ? "Invoicing & Payments"
                  : currentPage === "reviews"
                  ? "Reviews"
                  : "Shop Profile"}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                {currentPage === "overview"
                  ? "Welcome back! Here's what's happening at your shop today."
                  : currentPage === "bookings"
                  ? "Manage appointments and track service scheduling."
                  : currentPage === "services"
                  ? "Configure your service menu and pricing structure."
                  : currentPage === "payments"
                  ? "Track revenue and manage invoicing for your business."
                  : currentPage === "reviews"
                  ? "Respond to customer reviews and manage your reputation."
                  : "Update your shop profile and business settings."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-slate-600 hover:bg-blue-50"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>

          {/* Dynamic Content */}
          {renderMainContent()}
        </div>
      </main>

      {/* Booking Details Modal */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] rounded-2xl border-0 shadow-2xl bg-white p-0">
          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-slate-50/50 flex-shrink-0">
              <DialogTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-slate-800 truncate">
                    {selectedJob?.customer}
                  </h2>
                  <p className="text-sm text-slate-500 truncate">
                    {selectedJob?.vehicle} • {selectedJob?.service}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedJob && (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Dialog Tabs */}
                <div className="px-6 py-3 border-b border-slate-100 flex-shrink-0">
                  <div className="grid grid-cols-3 bg-slate-50 rounded-xl p-1 h-11">
                    <button
                      onClick={() => setActiveDetailTab("details")}
                      className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
                        activeDetailTab === "details"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <Info className="h-4 w-4" />
                      Job Details
                    </button>
                    <button
                      onClick={() => setActiveDetailTab("history")}
                      className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
                        activeDetailTab === "history"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <History className="h-4 w-4" />
                      Vehicle History
                    </button>
                    <button
                      onClick={() => setActiveDetailTab("customer")}
                      className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
                        activeDetailTab === "customer"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Customer Info
                    </button>
                  </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  {activeDetailTab === "details" && (
                    <div className="px-6 py-4 space-y-6">
                      {/* Status and Schedule */}
                      <Card className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl">
                        <CardContent className="p-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-blue-700 mb-1">
                                Status
                              </p>
                              <Badge
                                className={
                                  statusConfig.jobStage[selectedJob.stage]
                                    .className
                                }
                              >
                                {statusConfig.jobStage[selectedJob.stage].label}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-700 mb-1">
                                Priority
                              </p>
                              <div className="flex items-center gap-1">
                                {selectedJob.priority === "urgent" && (
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    selectedJob.priority === "urgent"
                                      ? "text-amber-600"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {selectedJob.priority === "urgent"
                                    ? "URGENT"
                                    : "Normal"}
                                </span>
                              </div>
                            </div>
                            {selectedJob.timeStart && (
                              <>
                                <div>
                                  <p className="text-sm font-medium text-blue-700 mb-1">
                                    Scheduled Time
                                  </p>
                                  <p className="text-sm text-slate-700">
                                    {selectedJob.timeStart} -{" "}
                                    {selectedJob.timeEnd}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-blue-700 mb-1">
                                    Service Bay
                                  </p>
                                  <p className="text-sm text-slate-700">
                                    {selectedJob.bay}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Service Details */}
                      <Card className="rounded-xl">
                        <CardHeader>
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
                                {selectedJob.service}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">
                                Estimated Duration
                              </p>
                              <p className="text-base text-slate-700">
                                {selectedJob.duration}
                              </p>
                            </div>
                          </div>

                          {selectedJob.description && (
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-2">
                                Customer Request
                              </p>
                              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                                <p className="text-sm text-amber-800 italic">
                                  &ldquo;{selectedJob.description}&rdquo;
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Cost Breakdown */}
                      {selectedJob.finalPrice && (
                        <Card className="rounded-xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-green-500" />
                              Cost Breakdown
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">
                                  Labor
                                </span>
                                <span className="font-medium">
                                  ${Math.round(selectedJob.finalPrice * 0.7)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">
                                  Parts
                                </span>
                                <span className="font-medium">
                                  ${Math.round(selectedJob.finalPrice * 0.2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">
                                  GST (10%)
                                </span>
                                <span className="font-medium">
                                  ${Math.round(selectedJob.finalPrice * 0.1)}
                                </span>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-base font-semibold">
                                    Total
                                  </span>
                                  <span className="text-lg font-bold text-green-600">
                                    ${selectedJob.finalPrice}
                                  </span>
                                </div>
                              </div>
                              <Badge
                                className={
                                  statusConfig.paymentStatus[
                                    selectedJob.paymentStatus
                                  ].className
                                }
                              >
                                {
                                  statusConfig.paymentStatus[
                                    selectedJob.paymentStatus
                                  ].label
                                }
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {activeDetailTab === "history" && (
                    <div className="px-6 py-4">
                      <Card className="rounded-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5 text-purple-500" />
                            Service History for {selectedJob.vehicle}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Mock service history */}
                            <div className="border-l-2 border-blue-200 pl-4 space-y-4">
                              <div className="relative">
                                <div className="absolute -left-6 w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-slate-800">
                                      Oil Change & Filter
                                    </p>
                                    <span className="text-xs text-slate-500">
                                      2024-07-15
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    Regular maintenance service completed
                                  </p>
                                  <p className="text-sm font-medium text-green-600 mt-1">
                                    $120 • Paid
                                  </p>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-6 w-3 h-3 bg-amber-500 rounded-full"></div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-slate-800">
                                      Brake Inspection
                                    </p>
                                    <span className="text-xs text-slate-500">
                                      2024-05-22
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    Annual safety inspection passed
                                  </p>
                                  <p className="text-sm font-medium text-green-600 mt-1">
                                    $80 • Paid
                                  </p>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-6 w-3 h-3 bg-purple-500 rounded-full"></div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-slate-800">
                                      Tire Rotation
                                    </p>
                                    <span className="text-xs text-slate-500">
                                      2024-03-10
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    Four tire rotation and pressure check
                                  </p>
                                  <p className="text-sm font-medium text-green-600 mt-1">
                                    $45 • Paid
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeDetailTab === "customer" && (
                    <div className="px-6 py-4">
                      <Card className="rounded-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-green-500" />
                            Customer Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-slate-700 mb-3">
                                Contact Details
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <Phone className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">
                                    {selectedJob.phone}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Mail className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">
                                    {selectedJob.customerEmail}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-700 mb-3">
                                Vehicle Information
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <Car className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">
                                    {selectedJob.vehicle}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-700 mb-3">
                              Customer Notes
                            </h4>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                              <p className="text-sm text-blue-800">
                                Regular customer since 2023. Prefers morning
                                appointments. Always pays on time.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Dialog Footer with Actions */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {/* Communication Actions */}
                    <div className="flex gap-2 flex-1">
                      <Button
                        variant="outline"
                        onClick={() => handleContactCustomer(selectedJob.phone)}
                        className="flex-1 rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Customer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleMessageCustomer(selectedJob)}
                        className="flex-1 rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>

                    {/* Primary Action - Gets more width */}
                    <div className="flex gap-2 flex-1">
                      {selectedJob.stage === "confirmed" && (
                        <Button
                          onClick={() => {
                            handleMarkInProgress(selectedJob.id);
                            setBookingDetailsOpen(false);
                          }}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-sm"
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Begin Service
                        </Button>
                      )}

                      {selectedJob.stage === "in-progress" && (
                        <Button
                          onClick={() => {
                            handleMarkCompleted(selectedJob.id);
                            setBookingDetailsOpen(false);
                          }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}

                      {(selectedJob.stage === "quote-requested" ||
                        selectedJob.stage === "quote-sent") && (
                        <Button
                          onClick={() => {
                            setBookingDetailsOpen(false);
                            router.push(`/quote/${selectedJob.id}`);
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-sm"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {selectedJob.stage === "quote-requested"
                            ? "Create Quote"
                            : "Update Quote"}
                        </Button>
                      )}

                      {selectedJob.stage === "completed" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Download quote/invoice functionality
                            const element = document.createElement("a");
                            const fileContent = `
Job Details - ${selectedJob.customer}
Vehicle: ${selectedJob.vehicle}
Service: ${selectedJob.service}
Date: ${selectedJob.date}
${selectedJob.finalPrice ? `Total: $${selectedJob.finalPrice}` : ""}
${selectedJob.description ? `Notes: ${selectedJob.description}` : ""}
                            `;
                            const file = new Blob([fileContent], {
                              type: "text/plain",
                            });
                            element.href = URL.createObjectURL(file);
                            element.download = `${selectedJob.customer.replace(
                              /\s+/g,
                              "_"
                            )}_job_${selectedJob.id}.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          className="flex-1 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
