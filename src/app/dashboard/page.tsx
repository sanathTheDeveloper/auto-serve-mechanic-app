"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  Hammer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ServiceMenuManager } from "@/components/ServiceMenuManager";
import { InvoicingPage } from "@/components/invoicing/InvoicingPage";
import { ReviewsManagement } from "@/components/reviews/ReviewsManagement";
import { ShopProfileSettings } from "@/components/ShopProfileSettings";
import { mockJobs, statusConfig, getJobsByStage } from "@/data/jobs";
import { Job, JobFilter } from "@/types/booking";
import Image from "next/image";

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
    { id: "settings", icon: Settings, label: "Settings" },
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
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<
    "details" | "history" | "customer"
  >("details");

  // Shop profile save ref
  const shopProfileSaveRef = useRef<(() => Promise<void>) | null>(null);

  // New booking form state
  const [newBookingForm, setNewBookingForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleLicense: "",
    serviceType: "",
    description: "",
    preferredDate: "",
    preferredTime: "",
    priority: "medium" as "low" | "medium" | "high"
  });

  // Mock notification count for badge (in a real app, this would come from an API)
  const unreadNotificationCount = 3;

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

  // New booking form handlers
  const handleNewBookingFormChange = (field: string, value: string) => {
    setNewBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewBookingSubmit = async () => {
    try {
      // Basic validation
      if (!newBookingForm.customerName || !newBookingForm.customerPhone || !newBookingForm.serviceType) {
        alert("Please fill in all required fields (Customer Name, Phone, and Service Type)");
        return;
      }

      // Create new booking object
      const newBooking = {
        id: `job-${Date.now()}`,
        customer: {
          name: newBookingForm.customerName,
          email: newBookingForm.customerEmail,
          phone: newBookingForm.customerPhone,
        },
        vehicle: {
          make: newBookingForm.vehicleMake,
          model: newBookingForm.vehicleModel,
          year: newBookingForm.vehicleYear,
          license: newBookingForm.vehicleLicense,
        },
        service: {
          type: newBookingForm.serviceType,
          description: newBookingForm.description,
        },
        scheduling: {
          preferredDate: newBookingForm.preferredDate,
          preferredTime: newBookingForm.preferredTime,
        },
        priority: newBookingForm.priority,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Here you would typically send this to your backend API
      console.log("New booking created:", newBooking);
      
      // Simulate sending notification to customer
      const notificationMessage = `
Dear ${newBookingForm.customerName},

Your service booking has been confirmed! Here are the details:

🚗 Vehicle: ${newBookingForm.vehicleMake} ${newBookingForm.vehicleModel} ${newBookingForm.vehicleYear}
🔧 Service: ${newBookingForm.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
📅 Preferred Date: ${newBookingForm.preferredDate ? format(new Date(newBookingForm.preferredDate), 'MMMM d, yyyy') : 'To be scheduled'}
⏰ Preferred Time: ${newBookingForm.preferredTime ? newBookingForm.preferredTime.replace(':', ':') + (parseInt(newBookingForm.preferredTime) < 12 ? ' AM' : ' PM') : 'To be confirmed'}
⚡ Priority: ${newBookingForm.priority.charAt(0).toUpperCase() + newBookingForm.priority.slice(1)}

We will contact you shortly to confirm the appointment details.

Best regards,
Auto Serve Team
      `.trim();

      // In a real app, you would send SMS/Email here
      console.log("Customer notification:", {
        to: newBookingForm.customerPhone,
        email: newBookingForm.customerEmail,
        message: notificationMessage
      });
      
      // Show success message
      alert(`Booking created successfully! 
      
✅ Booking ID: ${newBooking.id}
📱 Customer notification sent to: ${newBookingForm.customerPhone}
${newBookingForm.customerEmail ? `📧 Email confirmation sent to: ${newBookingForm.customerEmail}` : ''}`);
      
      // Reset form and close modal
      setNewBookingForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleLicense: "",
        serviceType: "",
        description: "",
        preferredDate: "",
        preferredTime: "",
        priority: "medium"
      });
      setNewBookingOpen(false);
      
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error creating booking. Please try again.");
    }
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Enhanced Calendar */}
      <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-2xl overflow-hidden lg:col-span-3">
        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-slate-50/80 border-b border-blue-100/50 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-base md:text-lg font-semibold text-slate-800 truncate">
                  Interactive Job Calendar
                </span>
                <p className="text-xs md:text-sm text-slate-500 font-normal">
                  Manage your schedule
                </p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 md:gap-3 text-xs bg-white/60 rounded-xl px-2 md:px-3 py-2 border border-blue-100/50">
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
        <CardContent className="p-3 md:p-6">
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
            className="rounded-md border-0 w-full text-sm md:text-base"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-center">
              <div className="p-2 bg-amber-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-amber-600">
                  {Object.values(jobCountsByDate).reduce(
                    (sum, day) => sum + (day.byStage["quote-requested"] || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-amber-700">New Quotes</div>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-blue-600">
                  {Object.values(jobCountsByDate).reduce(
                    (sum, day) => sum + (day.byStage["confirmed"] || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-blue-700">Upcoming</div>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-purple-600">
                  {Object.values(jobCountsByDate).reduce(
                    (sum, day) => sum + (day.byStage["in-progress"] || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-purple-700">In Progress</div>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-green-600">
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
        <CardHeader className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 border-b border-slate-100/50 p-4 md:p-6">
          <CardTitle className="text-sm md:text-base flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs md:text-sm font-bold">
                {format(selectedDate, "d")}
              </span>
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 text-base md:text-lg truncate">
                {format(selectedDate, "MMM d")}
              </div>
              <div className="text-xs md:text-sm text-slate-500 font-normal">
                {format(selectedDate, "EEEE")}
              </div>
            </div>
          </CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            {selectedDateJobs.length} job
            {selectedDateJobs.length !== 1 ? "s" : ""} scheduled
          </p>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
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
        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 ${
          isQuoteRequest
            ? "bg-amber-50/50 border-amber-200/50 hover:bg-amber-100/50"
            : "bg-slate-50/50 border-slate-200/50 hover:bg-slate-100/50"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="text-center min-w-[50px]">
            {isQuoteRequest ? (
              <>
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mx-auto mb-0.5">
                  <FileText className="h-3 w-3 text-white" />
                </div>
                <div className="text-xs font-medium text-amber-600">QUOTE</div>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-slate-800">
                  {job.timeStart}
                </div>
                <div className="text-xs text-slate-500">{job.bay}</div>
              </>
            )}
          </div>
          <div className="border-l border-slate-300 pl-2.5 min-w-0 flex-1">
            <div className="font-medium text-slate-800 text-sm truncate">{job.customer}</div>
            <div className="text-xs text-slate-600 truncate">{job.vehicle}</div>
            <div className="text-xs text-slate-500 truncate">{job.service}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge
            className={`${stageConfig.className} text-xs px-1.5 py-0.5`}
            variant="secondary"
          >
            {stageConfig.label}
          </Badge>
          {job.priority === "urgent" && (
            <AlertCircle className="h-3 w-3 text-amber-500" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {quickStats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
                      >
                        <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
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
                      <p className="text-lg md:text-2xl font-bold text-slate-800 mb-1">
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

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
              {/* Today's Schedule - Enhanced with Actionable Cards */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 xl:col-span-3">
                <CardHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base md:text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">Today&apos;s Schedule</span>
                      </CardTitle>
                      <p className="text-xs md:text-sm text-slate-600 -mt-1">
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
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs md:text-sm"
                    >
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">View Calendar</span>
                      <span className="sm:hidden">Calendar</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                  {getTodaysBookings().length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No bookings scheduled for today</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Quote Requests */}
                      {getTodaysBookings().filter(
                        (job) =>
                          job.stage === "quote-requested" ||
                          job.stage === "quote-sent"
                      ).length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-3 w-3 text-amber-500" />
                            <h4 className="text-xs font-medium text-amber-700">
                              Quote Requests
                            </h4>
                          </div>
                          <div className="space-y-1.5">
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
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-3 w-3 text-blue-500" />
                            <h4 className="text-xs font-medium text-slate-700">
                              Scheduled Appointments
                            </h4>
                          </div>
                          <div className="space-y-1.5">
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

              {/* Workshop Status - Mechanic Focused */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 h-fit">
                <CardContent className="p-4 xl:p-6">
                  <h3 className="text-sm xl:text-lg font-semibold text-slate-800 mb-4 xl:mb-5 flex items-center gap-2">
                    <Wrench className="h-4 w-4 xl:h-5 xl:w-5 text-blue-500" />
                    Workshop Status
                  </h3>
                  
                  {/* Active Jobs Progress */}
                  <div className="space-y-3 xl:space-y-4 mb-4 xl:mb-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 xl:p-4">
                      <div className="flex items-center justify-between mb-2 xl:mb-3">
                        <span className="text-xs xl:text-sm font-medium text-purple-700">Jobs In Progress</span>
                        <Badge className="bg-purple-100 text-purple-800 text-xs xl:text-sm">
                          {getTodaysBookings().filter(j => j.stage === "in-progress").length} Active
                        </Badge>
                      </div>
                      {getTodaysBookings().filter(j => j.stage === "in-progress").length > 0 ? (
                        <div className="space-y-2 xl:space-y-3">
                          {getTodaysBookings()
                            .filter(j => j.stage === "in-progress")
                            .slice(0, 2)
                            .map(job => (
                              <div key={job.id} className="bg-white/70 rounded-md p-2 xl:p-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs xl:text-sm font-medium text-purple-800 truncate">{job.customer}</div>
                                    <div className="text-xs text-purple-600 truncate">{job.vehicle}</div>
                                  </div>
                                  <Badge className="bg-purple-200 text-purple-800 text-xs font-medium ml-2 flex-shrink-0">
                                    {job.bay}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-xs xl:text-sm text-purple-600 text-center py-2">No jobs currently in progress</p>
                      )}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 xl:p-4">
                      <div className="flex items-center justify-between mb-2 xl:mb-3">
                        <span className="text-xs xl:text-sm font-medium text-amber-700">Quotes Pending</span>
                        <Badge className="bg-amber-100 text-amber-800 text-xs xl:text-sm">
                          {getTodaysBookings().filter(j => j.stage === "quote-requested" || j.stage === "quote-sent").length} Jobs
                        </Badge>
                      </div>
                      {getTodaysBookings().filter(j => j.stage === "quote-requested" || j.stage === "quote-sent").length > 0 ? (
                        <div className="space-y-2 xl:space-y-3">
                          {getTodaysBookings()
                            .filter(j => j.stage === "quote-requested" || j.stage === "quote-sent")
                            .slice(0, 2)
                            .map(job => (
                              <div key={job.id} className="bg-white/70 rounded-md p-2 xl:p-2.5 flex items-center justify-between">
                                <span className="text-xs xl:text-sm font-medium text-amber-800 truncate flex-1">{job.customer}</span>
                                <Badge className="bg-amber-200 text-amber-800 text-xs font-medium ml-2 flex-shrink-0">
                                  {job.stage === "quote-sent" ? "Sent" : "Pending"}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-xs xl:text-sm text-amber-600 text-center py-2">No pending quotes</p>
                      )}
                    </div>
                  </div>

                  {/* Service Bay Status */}
                  <div className="border-t border-slate-200 pt-3 xl:pt-4">
                    <h4 className="text-xs xl:text-sm font-semibold text-slate-700 mb-2 xl:mb-3 flex items-center gap-1">
                      <MapPin className="h-3 w-3 xl:h-4 xl:w-4" />
                      Service Bays
                    </h4>
                    <div className="grid grid-cols-1 gap-2 xl:gap-3">
                      <div className="bg-slate-50 rounded-md p-2 xl:p-2.5 flex justify-between items-center">
                        <span className="text-xs xl:text-sm text-slate-700 font-medium">Bay 1 - Diagnostics</span>
                        <Badge className="bg-green-100 text-green-800 text-xs xl:text-sm px-2 py-1">
                          Available
                        </Badge>
                      </div>
                      <div className="bg-slate-50 rounded-md p-2 xl:p-2.5 flex justify-between items-center">
                        <span className="text-xs xl:text-sm text-slate-700 font-medium">Bay 2 - General Service</span>
                        <Badge className="bg-blue-100 text-blue-800 text-xs xl:text-sm px-2 py-1">
                          Occupied
                        </Badge>
                      </div>
                      <div className="bg-slate-50 rounded-md p-2 xl:p-2.5 flex justify-between items-center">
                        <span className="text-xs xl:text-sm text-slate-700 font-medium">Bay 3 - Heavy Repair</span>
                        <Badge className="bg-amber-100 text-amber-800 text-xs xl:text-sm px-2 py-1">
                          Reserved
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Tools & Equipment Status */}
                  <div className="mt-4 xl:mt-5 pt-3 xl:pt-4 border-t border-slate-200">
                    <h4 className="text-xs xl:text-sm font-semibold text-slate-700 mb-2 xl:mb-3 flex items-center gap-1">
                      <Hammer className="h-3 w-3 xl:h-4 xl:w-4" />
                      Equipment Status
                    </h4>
                    <div className="space-y-2 xl:space-y-3">
                      <div className="bg-slate-50 rounded-md p-2 xl:p-2.5 flex justify-between items-center">
                        <span className="text-xs xl:text-sm text-slate-700 font-medium">Vehicle Lift #1</span>
                        <Badge className="bg-green-100 text-green-700 text-xs xl:text-sm px-2 py-1">
                          Operational
                        </Badge>
                      </div>
                      <div className="bg-slate-50 rounded-md p-2 xl:p-2.5 flex justify-between items-center">
                        <span className="text-xs xl:text-sm text-slate-700 font-medium">Diagnostic Scanner</span>
                        <Badge className="bg-green-100 text-green-700 text-xs xl:text-sm px-2 py-1">
                          Available
                        </Badge>
                      </div>
                      <div className="bg-slate-50 rounded-md p-2 xl:p-2.5 flex justify-between items-center">
                        <span className="text-xs xl:text-sm text-slate-700 font-medium">Alignment Machine</span>
                        <Badge className="bg-amber-100 text-amber-700 text-xs xl:text-sm px-2 py-1">
                          In Use
                        </Badge>
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
          <div className="space-y-4 md:space-y-6">
            {/* View Mode Toggle and Filters */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="flex-1 min-w-0 sm:min-w-64">
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
                        className="pl-10 text-sm"
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
                <TabsList className="inline-flex h-10 md:h-12 items-center justify-center rounded-lg md:rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg p-1 mb-4 md:mb-6 w-full overflow-x-auto">
                  <TabsTrigger
                    value="quotes"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 md:px-4 py-2 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50/50 flex-1 gap-1 md:gap-2"
                  >
                    <FileText className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">New Quotes</span>
                    <span className="sm:hidden">Quotes</span>
                    {tabCounts.quotes > 0 && (
                      <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                        {tabCounts.quotes}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="upcoming"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 md:px-4 py-2 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 flex-1 gap-1 md:gap-2"
                  >
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Upcoming</span>
                    {tabCounts.upcoming > 0 && (
                      <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                        {tabCounts.upcoming}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="progress"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 md:px-4 py-2 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 flex-1 gap-1 md:gap-2"
                  >
                    <PlayCircle className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">In Progress</span>
                    <span className="sm:hidden">Progress</span>
                    {tabCounts.progress > 0 && (
                      <span className="ml-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                        {tabCounts.progress}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 md:px-4 py-2 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-green-600 hover:bg-green-50/50 flex-1 gap-1 md:gap-2"
                  >
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
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
        return <ReviewsManagement />;

      case "settings":
        return <ShopProfileSettings saveRef={shopProfileSaveRef} />;

      default:
        return renderMainContent();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-16 md:w-20" : "w-56 md:w-64 lg:w-72"
        } transition-all duration-300 bg-white/95 backdrop-blur-sm border-r border-blue-200/50 shadow-xl flex flex-col relative min-w-0`}
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
            isCollapsed ? "p-2 md:p-3" : "px-3 py-3 md:px-4"
          } border-b border-blue-200/50`}
        >
          <div
            className={`${
              isCollapsed
                ? "flex items-center justify-center"
                : "flex items-center gap-3"
            }`}
          >
            <div
              className="cursor-pointer hover:scale-105 transition-all duration-200"
              onClick={() => router.push("/")}
            >
              <Image
                src="/sideNavBar-logo.png"
                alt="Auto Serve Sidebar Logo"
                width={48}
                height={48}
                className="object-contain drop-shadow-lg w-10 h-10 md:w-12 md:h-12"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="cursor-pointer" onClick={() => router.push("/")}>
                <p className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                  Auto Serve
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 bg-gradient-to-r from-blue-50/50 to-orange-50/50 border border-blue-200/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs md:text-sm"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={`flex-1 ${isCollapsed ? "px-2 md:px-3" : "p-3 md:p-4"}`}>
          <nav className={`space-y-2 md:space-y-3 ${isCollapsed ? "md:space-y-4" : ""}`}>
            {getNavigationItems().map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`group relative w-full flex items-center ${
                  isCollapsed ? "justify-center" : "gap-2 md:gap-3"
                } ${
                  isCollapsed ? "px-2 py-3 md:px-3 md:py-4" : "px-3 py-2 md:px-4 md:py-3"
                } rounded-lg md:rounded-xl text-left transition-all duration-200 ${
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
                      isCollapsed ? "h-5 w-5 md:h-6 md:w-6 mb-0 md:mb-1" : "h-4 w-4 md:h-5 md:w-5"
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
                    <span className="flex-1 font-medium text-sm md:text-base">{item.label}</span>
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
          <div className="p-3 md:p-4 border-t border-blue-200/50">
            <div className="flex justify-center">
              <div
                className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-all duration-200 hover:scale-105"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <span className="text-white font-bold text-xs md:text-sm">
                  {user?.firstName?.[0] || "U"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer for expanded state */}
        {!isCollapsed && (
          <div className="p-3 md:p-4 border-t border-blue-200/50">
            <div className="flex items-center gap-2 md:gap-3 mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs md:text-sm">
                  {user?.firstName?.[0] || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-slate-800 truncate">
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
      <main className="flex-1 overflow-auto p-3 md:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent truncate">
                {currentPage === "overview"
                  ? "Overview"
                  : currentPage === "services"
                  ? "Service Menu"
                  : currentPage === "bookings"
                  ? "Booking Management"
                  : currentPage === "payments"
                  ? "Invoicing & Payments"
                  : currentPage === "reviews"
                  ? "Review Management"
                  : "Shop Profile"}
              </h1>
              <p className="text-slate-600 text-xs md:text-sm mt-1 line-clamp-2">
                {currentPage === "overview"
                  ? "Welcome back! Here's what's happening at your shop today."
                  : currentPage === "bookings"
                  ? "Streamline appointments and optimize your service workflow for maximum efficiency."
                  : currentPage === "services"
                  ? "Configure your service menu and pricing structure."
                  : currentPage === "payments"
                  ? "Track revenue and manage invoicing for your business."
                  : currentPage === "reviews"
                  ? "Build trust and strengthen customer relationships through thoughtful review engagement."
                  : "Update your shop profile and business settings."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {currentPage !== "settings" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-slate-600 hover:bg-blue-50 relative"
                  onClick={() => router.push("/notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {unreadNotificationCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600"
                    >
                      {unreadNotificationCount}
                    </Badge>
                  )}
                </Button>
              )}
              {currentPage === "settings" && (
                <Button
                  size="sm"
                  onClick={() => shopProfileSaveRef.current?.()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
              {currentPage !== "settings" && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => setNewBookingOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              )}
            </div>
          </div>

          {/* Dynamic Content */}
          {renderMainContent()}
        </div>
      </main>

      {/* Booking Details Modal */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent className="max-w-4xl lg:max-w-5xl w-[95vw] sm:w-[90vw] max-h-[90vh] rounded-xl md:rounded-2xl border-0 shadow-2xl bg-white p-0">
          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-slate-50/50 flex-shrink-0">
              <DialogTitle className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl shadow-lg">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-lg font-semibold text-slate-800 truncate">
                    {selectedJob?.customer}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 truncate">
                    {selectedJob?.vehicle} • {selectedJob?.service}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedJob && (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Dialog Tabs */}
                <div className="px-4 md:px-6 py-3 border-b border-slate-100 flex-shrink-0">
                  <div className="grid grid-cols-3 bg-slate-50 rounded-lg md:rounded-xl p-1 h-9 md:h-11">
                    <button
                      onClick={() => setActiveDetailTab("details")}
                      className={`flex items-center justify-center gap-1 md:gap-2 rounded-lg font-medium transition-all text-xs md:text-sm ${
                        activeDetailTab === "details"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <Info className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Job Details</span>
                      <span className="sm:hidden">Details</span>
                    </button>
                    <button
                      onClick={() => setActiveDetailTab("history")}
                      className={`flex items-center justify-center gap-1 md:gap-2 rounded-lg font-medium transition-all text-xs md:text-sm ${
                        activeDetailTab === "history"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <History className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Vehicle History</span>
                      <span className="sm:hidden">History</span>
                    </button>
                    <button
                      onClick={() => setActiveDetailTab("customer")}
                      className={`flex items-center justify-center gap-1 md:gap-2 rounded-lg font-medium transition-all text-xs md:text-sm ${
                        activeDetailTab === "customer"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <User className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Customer Info</span>
                      <span className="sm:hidden">Customer</span>
                    </button>
                  </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  {activeDetailTab === "details" && (
                    <div className="px-4 md:px-6 py-4 space-y-4 md:space-y-6">
                      {/* Status and Schedule */}
                      <Card className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl">
                        <CardContent className="p-4 md:p-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
                <div className="px-4 md:px-6 py-3 md:py-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col gap-2 md:gap-3 w-full">
                    {/* Communication Actions */}
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        onClick={() => handleContactCustomer(selectedJob.phone)}
                        className="flex-1 rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300 text-xs md:text-sm"
                      >
                        <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Call Customer</span>
                        <span className="sm:hidden">Call</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleMessageCustomer(selectedJob)}
                        className="flex-1 rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300 text-xs md:text-sm"
                      >
                        <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Send Message</span>
                        <span className="sm:hidden">Message</span>
                      </Button>
                    </div>

                    {/* Primary Action - Gets more width */}
                    <div className="flex gap-2 w-full">
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

      {/* New Booking Modal */}
      <Dialog open={newBookingOpen} onOpenChange={setNewBookingOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] lg:w-[85vw] xl:w-[80vw] max-h-[95vh] rounded-xl md:rounded-2xl border-0 shadow-2xl bg-white p-0 overflow-hidden">
          <div className="flex flex-col h-full max-h-[95vh]">
            <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-slate-50/50 flex-shrink-0">
              <DialogTitle className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800">
                    Create New Booking
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Add a new service booking for a customer
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ maxHeight: 'calc(95vh - 160px)' }}>
              <div className="space-y-4 lg:space-y-6">
                {/* Customer Information */}
                <div className="space-y-3 lg:space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Customer Name *
                      </label>
                      <Input
                        placeholder="Enter customer name"
                        value={newBookingForm.customerName}
                        onChange={(e) => handleNewBookingFormChange("customerName", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Phone Number *
                      </label>
                      <Input
                        placeholder="Enter phone number"
                        value={newBookingForm.customerPhone}
                        onChange={(e) => handleNewBookingFormChange("customerPhone", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                    <div className="space-y-3 lg:col-span-2">
                      <label className="text-sm font-medium text-slate-700">
                        Email Address
                      </label>
                      <Input
                        placeholder="Enter email address"
                        type="email"
                        value={newBookingForm.customerEmail}
                        onChange={(e) => handleNewBookingFormChange("customerEmail", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-3 lg:space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-500" />
                    Vehicle Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Make
                      </label>
                      <Input
                        placeholder="e.g., Toyota"
                        value={newBookingForm.vehicleMake}
                        onChange={(e) => handleNewBookingFormChange("vehicleMake", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Model
                      </label>
                      <Input
                        placeholder="e.g., Camry"
                        value={newBookingForm.vehicleModel}
                        onChange={(e) => handleNewBookingFormChange("vehicleModel", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Year
                      </label>
                      <Input
                        placeholder="e.g., 2020"
                        value={newBookingForm.vehicleYear}
                        onChange={(e) => handleNewBookingFormChange("vehicleYear", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-3 lg:col-span-3">
                      <label className="text-sm font-medium text-slate-700">
                        License Plate
                      </label>
                      <Input
                        placeholder="Enter license plate number"
                        value={newBookingForm.vehicleLicense}
                        onChange={(e) => handleNewBookingFormChange("vehicleLicense", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-3 lg:space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    Service Information
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Service Type *
                      </label>
                      <Select
                        value={newBookingForm.serviceType}
                        onValueChange={(value) => handleNewBookingFormChange("serviceType", value)}
                      >
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oil-change">Oil Change</SelectItem>
                          <SelectItem value="brake-service">Brake Service</SelectItem>
                          <SelectItem value="tire-service">Tire Service</SelectItem>
                          <SelectItem value="engine-diagnostic">Engine Diagnostic</SelectItem>
                          <SelectItem value="transmission">Transmission Service</SelectItem>
                          <SelectItem value="ac-service">A/C Service</SelectItem>
                          <SelectItem value="battery-service">Battery Service</SelectItem>
                          <SelectItem value="inspection">Vehicle Inspection</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Priority Level
                      </label>
                      <Select
                        value={newBookingForm.priority}
                        onValueChange={(value) => handleNewBookingFormChange("priority", value)}
                      >
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Routine maintenance</SelectItem>
                          <SelectItem value="medium">Medium - Standard service</SelectItem>
                          <SelectItem value="high">High - Urgent repair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3 lg:col-span-2">
                      <label className="text-sm font-medium text-slate-700">
                        Service Description
                      </label>
                      <Textarea
                        placeholder="Describe the service needed or any specific issues..."
                        value={newBookingForm.description}
                        onChange={(e) => handleNewBookingFormChange("description", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 min-h-[90px] lg:min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="space-y-3 lg:space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Preferred Scheduling
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Preferred Date
                      </label>
                      <Input
                        type="date"
                        value={newBookingForm.preferredDate}
                        onChange={(e) => handleNewBookingFormChange("preferredDate", e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">
                        Preferred Time
                      </label>
                      <Select
                        value={newBookingForm.preferredTime}
                        onValueChange={(value) => handleNewBookingFormChange("preferredTime", value)}
                      >
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 h-10">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8:00">8:00 AM</SelectItem>
                          <SelectItem value="9:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-slate-100 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setNewBookingOpen(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNewBookingSubmit}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Booking
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
