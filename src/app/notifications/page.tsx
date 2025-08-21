"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
  DollarSign,
  Star,
  Clock,
  Info,
  Filter,
  Eye,
  Trash2,
  User,
  Phone,
} from "lucide-react";

// Notification types for mechanic workshop
interface Notification {
  id: string;
  type: "booking" | "urgent" | "payment" | "review" | "reminder" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  priority: "low" | "medium" | "high";
  relatedId?: string;
  customerName?: string;
  customerPhone?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "urgent",
    title: "Urgent: Vehicle Breakdown",
    message:
      "Sarah Johnson needs immediate roadside assistance. Vehicle won't start on Highway 101.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    actionable: true,
    priority: "high",
    customerName: "Sarah Johnson",
    customerPhone: "(555) 123-4567",
  },
  {
    id: "notif-2",
    type: "booking",
    title: "New Booking Request",
    message:
      "Mike Chen has requested a brake service appointment for tomorrow at 10:00 AM.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    actionable: true,
    priority: "medium",
    relatedId: "booking-123",
    customerName: "Mike Chen",
    customerPhone: "(555) 987-6543",
  },
  {
    id: "notif-3",
    type: "payment",
    title: "Payment Received",
    message:
      "Emma Davis has completed payment of $320.50 for oil change and tire rotation.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    actionable: false,
    priority: "low",
    customerName: "Emma Davis",
  },
  {
    id: "notif-4",
    type: "reminder",
    title: "Service Due Reminder",
    message:
      "John Wilson's 2019 Honda Civic is due for 60,000-mile maintenance service.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionable: true,
    priority: "medium",
    customerName: "John Wilson",
    customerPhone: "(555) 456-7890",
  },
  {
    id: "notif-5",
    type: "review",
    title: "New Customer Review",
    message:
      'Lisa Park left a 5-star review for the transmission service. "Excellent work and fair pricing!"',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionable: false,
    priority: "low",
    customerName: "Lisa Park",
  },
  {
    id: "notif-6",
    type: "system",
    title: "Daily Report Ready",
    message: "Your daily performance report for today is ready for review.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionable: true,
    priority: "low",
  },
  {
    id: "notif-7",
    type: "booking",
    title: "Booking Cancelled",
    message:
      "David Kim has cancelled his appointment scheduled for tomorrow at 2:00 PM.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionable: false,
    priority: "medium",
    customerName: "David Kim",
  },
  {
    id: "notif-8",
    type: "urgent",
    title: "Low Inventory Alert",
    message:
      "Oil filters are running low (3 units remaining). Consider restocking soon.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionable: true,
    priority: "high",
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    showUnread: false,
    showUrgent: false,
    types: {
      booking: true,
      urgent: true,
      payment: true,
      review: true,
      reminder: true,
      system: true,
    },
  });

  // Filter notifications based on current filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Apply type filters
      if (!filters.types[notification.type]) return false;

      // Apply quick filters
      if (filters.showUnread && notification.read) return false;
      if (filters.showUrgent && notification.priority !== "high") return false;

      return true;
    });
  }, [notifications, filters]);

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/auth");
    }
  }, [isAuthenticated, user, router]);

  // Show loading while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Notification handlers
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const handleContactCustomer = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleNotificationAction = (notification: Notification) => {
    switch (notification.type) {
      case "urgent":
        if (notification.customerPhone) {
          handleContactCustomer(notification.customerPhone);
        }
        break;
      case "booking":
        if (notification.relatedId) {
          router.push("/bookings");
        }
        break;
      case "reminder":
        if (notification.customerPhone) {
          handleContactCustomer(notification.customerPhone);
        }
        break;
      case "system":
        router.push("/dashboard");
        break;
    }
    handleMarkAsRead(notification.id);
  };

  // Filter management functions
  const handleFilterChange = (filterType: string, value: boolean) => {
    if (filterType === "showUnread" || filterType === "showUrgent") {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    }
  };

  const handleTypeFilterChange = (
    type: keyof typeof filters.types,
    value: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: value,
      },
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      showUnread: false,
      showUrgent: false,
      types: {
        booking: true,
        urgent: true,
        payment: true,
        review: true,
        reminder: true,
        system: true,
      },
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "urgent":
        return AlertTriangle;
      case "booking":
        return CalendarIcon;
      case "payment":
        return DollarSign;
      case "review":
        return Star;
      case "reminder":
        return Clock;
      case "system":
        return Info;
      default:
        return Bell;
    }
  };

  // Get notification color based on priority
  const getNotificationColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-red-600";
      case "medium":
        return "from-amber-500 to-amber-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 bg-white/95 backdrop-blur-sm border-b border-blue-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Stay updated with your workshop activities and customer
                  requests
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-slate-600 hover:bg-blue-50 text-xs sm:text-sm"
                >
                  <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                  {(filters.showUnread ||
                    filters.showUrgent ||
                    !Object.values(filters.types).every(Boolean)) && (
                    <Badge
                      variant="secondary"
                      className="ml-1 sm:ml-2 bg-blue-100 text-blue-700 text-xs"
                    >
                      Active
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[65vh] sm:h-[45vh] lg:h-[55vh] bg-white rounded-t-2xl border-0 shadow-2xl flex flex-col"
              >
                <SheetHeader className="pb-3 border-b border-slate-100 flex-shrink-0">
                  <SheetTitle className="text-left text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-500" />
                    Filter Notifications
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 py-3 sm:py-4 space-y-3 sm:space-y-4 overflow-y-auto">
                  {/* Quick Filters */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Quick Filters
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                        <Checkbox
                          id="unread"
                          checked={filters.showUnread}
                          onCheckedChange={(checked) =>
                            handleFilterChange("showUnread", checked as boolean)
                          }
                        />
                        <label
                          htmlFor="unread"
                          className="text-sm font-medium text-slate-700 cursor-pointer flex-1"
                        >
                          Show unread only
                        </label>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 text-xs"
                        >
                          {notifications.filter((n) => !n.read).length}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                        <Checkbox
                          id="urgent"
                          checked={filters.showUrgent}
                          onCheckedChange={(checked) =>
                            handleFilterChange("showUrgent", checked as boolean)
                          }
                        />
                        <label
                          htmlFor="urgent"
                          className="text-sm font-medium text-slate-700 cursor-pointer flex-1"
                        >
                          Show urgent only
                        </label>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-700 text-xs"
                        >
                          {
                            notifications.filter((n) => n.priority === "high")
                              .length
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Notification Types
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {[
                        {
                          key: "booking",
                          label: "Bookings",
                          icon: CalendarIcon,
                          count: notifications.filter(
                            (n) => n.type === "booking"
                          ).length,
                        },
                        {
                          key: "urgent",
                          label: "Urgent",
                          icon: AlertTriangle,
                          count: notifications.filter(
                            (n) => n.type === "urgent"
                          ).length,
                        },
                        {
                          key: "payment",
                          label: "Payments",
                          icon: DollarSign,
                          count: notifications.filter(
                            (n) => n.type === "payment"
                          ).length,
                        },
                        {
                          key: "review",
                          label: "Reviews",
                          icon: Star,
                          count: notifications.filter(
                            (n) => n.type === "review"
                          ).length,
                        },
                        {
                          key: "reminder",
                          label: "Reminders",
                          icon: Clock,
                          count: notifications.filter(
                            (n) => n.type === "reminder"
                          ).length,
                        },
                        {
                          key: "system",
                          label: "System",
                          icon: Info,
                          count: notifications.filter(
                            (n) => n.type === "system"
                          ).length,
                        },
                      ].map(({ key, label, icon: Icon, count }) => (
                        <div
                          key={key}
                          className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <Checkbox
                            id={key}
                            checked={
                              filters.types[key as keyof typeof filters.types]
                            }
                            onCheckedChange={(checked) =>
                              handleTypeFilterChange(
                                key as keyof typeof filters.types,
                                checked as boolean
                              )
                            }
                          />
                          <label
                            htmlFor={key}
                            className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2 flex-1"
                          >
                            <Icon className="h-4 w-4 text-slate-500" />
                            {label}
                          </label>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 text-xs"
                          >
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100 bg-white flex-shrink-0">
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setFilterOpen(false)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Mark All Read</span>
                <span className="sm:hidden">Read All</span>
                <span className="hidden sm:inline">({unreadCount})</span>
                <span className="sm:hidden">({unreadCount})</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Results Summary */}
        {(filters.showUnread ||
          filters.showUrgent ||
          !Object.values(filters.types).every(Boolean)) && (
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-xl px-3 sm:px-4 py-3 gap-3 sm:gap-0">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter className="h-4 w-4" />
              <span className="text-xs sm:text-sm">
                Showing {filteredNotifications.length} of {notifications.length}{" "}
                notifications
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm self-start sm:self-auto"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200/50">
              <CardContent className="p-8 sm:p-12 text-center">
                <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-slate-600 mb-2">
                  No notifications found
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  {filteredNotifications.length !== notifications.length
                    ? "No notifications match your current filters. Try adjusting your filter settings."
                    : "You're all caught up! No new notifications at the moment."}
                </p>
                {filteredNotifications.length !== notifications.length && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`
                    bg-white/90 backdrop-blur-sm shadow-lg border transition-all duration-300 hover:shadow-xl
                    ${
                      !notification.read
                        ? "border-blue-200/70 bg-blue-50/30"
                        : "border-slate-200/50 hover:border-slate-300/50"
                    }
                  `}
                >
                  <CardContent className="p-4 sm:p-5 lg:p-6">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Icon */}
                      <div
                        className={`
                        flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br ${getNotificationColor(
                          notification.priority
                        )} 
                        rounded-lg flex items-center justify-center shadow-md
                      `}
                      >
                        <IconComponent className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <h3
                              className={`
                              text-sm sm:text-base font-semibold truncate
                              ${
                                !notification.read
                                  ? "text-slate-800"
                                  : "text-slate-700"
                              }
                            `}
                            >
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></span>
                              )}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-slate-500">
                              {format(
                                new Date(notification.timestamp),
                                "MMM d, h:mm a"
                              )}
                            </span>

                            {/* Priority Badge */}
                            {notification.priority === "high" && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Customer Info */}
                        {notification.customerName && (
                          <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                            <User className="h-3 w-3" />
                            <span>{notification.customerName}</span>
                            {notification.customerPhone && (
                              <>
                                <span>•</span>
                                <span>{notification.customerPhone}</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {notification.actionable && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleNotificationAction(notification)
                              }
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-8 text-xs"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              {notification.type === "urgent" &&
                                "Call Customer"}
                              {notification.type === "booking" &&
                                "View Booking"}
                              {notification.type === "reminder" &&
                                "Contact Customer"}
                              {notification.type === "system" && "View Report"}
                              {![
                                "urgent",
                                "booking",
                                "reminder",
                                "system",
                              ].includes(notification.type) && "Take Action"}
                            </Button>
                          )}

                          {notification.customerPhone &&
                            notification.type === "urgent" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    notification.customerPhone!
                                  );
                                  alert("Phone number copied to clipboard");
                                }}
                                className="border-slate-200 text-slate-600 hover:bg-slate-50 h-8 text-xs"
                              >
                                Copy Phone
                              </Button>
                            )}

                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="border-slate-200 text-slate-600 hover:bg-slate-50 h-8 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            className="border-red-200 text-red-600 hover:bg-red-50 h-8 text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
