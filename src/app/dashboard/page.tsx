"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

const navigationItems = [
  { id: "overview", icon: Home, label: "Overview" },
  { id: "bookings", icon: Calendar, label: "Bookings", badge: "12" },
  { id: "services", icon: Wrench, label: "Service Menu" },
  { id: "payments", icon: CreditCard, label: "Invoicing" },
  { id: "reviews", icon: Star, label: "Reviews", badge: "3" },
  { id: "settings", icon: Settings, label: "Shop Profile" },
];

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
    label: "This Week",
    value: "24",
    icon: Users,
    change: "+3 today",
    positive: true,
    color: "from-slate-600 to-slate-700",
  },
];

export default function DashboardSPA() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    
    // Redirect to shop profile if profile not completed
    if (user && (!user.hasCompletedProfile || user.isNewUser)) {
      router.push('/shop-profile');
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
    router.push('/');
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case "overview":
        return (
          <div className="space-y-6">
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

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50 lg:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Today&apos;s Schedule
                      </h3>
                      <p className="text-sm text-slate-600">
                        Upcoming bookings and services
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Calendar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        customer: "John Smith",
                        service: "Basic Service",
                        vehicle: "2019 Toyota Camry",
                        time: "10:30 AM",
                        duration: "45min",
                        status: "in-progress",
                        bay: "Bay 2",
                      },
                      {
                        customer: "Sarah Johnson",
                        service: "Brake Inspection",
                        vehicle: "2021 Honda Civic",
                        time: "11:15 AM",
                        duration: "30min",
                        status: "confirmed",
                        bay: "Bay 1",
                      },
                      {
                        customer: "Mike Wilson",
                        service: "Tire Rotation",
                        vehicle: "2020 Ford Focus",
                        time: "2:00 PM",
                        duration: "20min",
                        status: "pending",
                        bay: "Bay 3",
                      },
                    ].map((booking, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/30 to-orange-50/30 rounded-xl border border-blue-200/20 hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-slate-800">
                              {booking.customer}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                booking.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : booking.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            {booking.service} • {booking.vehicle}
                          </p>
                          <p className="text-xs text-slate-500">
                            {booking.bay} • {booking.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-700">
                            {booking.time}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 h-7 text-xs"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
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
                      <DollarSign className="h-4 w-4 mr-3" />
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
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">
                      Service Capacity
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Bay 1</span>
                        <span className="text-emerald-600 font-medium">
                          Available
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Bay 2</span>
                        <span className="text-blue-600 font-medium">
                          In Use
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Bay 3</span>
                        <span className="text-amber-600 font-medium">
                          Scheduled
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
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                    Booking Management
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Calendar view with appointment tracking and notifications
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              </div>
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>Calendar view and booking management features</p>
                <p className="text-sm">
                  Coming soon to your mechanic dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "services":
        return (
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                    Service Menu Customization
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Define what&apos;s included in basic vs full service, pricing,
                    and packages
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Wrench className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              <div className="text-center py-12 text-slate-500">
                <Wrench className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>Service menu customization and pricing management</p>
                <p className="text-sm">
                  Configure your offerings for customers
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "payments":
        return (
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                    Invoicing & Payments
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Track revenue, commission deductions, and pending payments
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
              <div className="text-center py-12 text-slate-500">
                <CreditCard className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>Simple dashboard for tracking incoming revenue</p>
                <p className="text-sm">
                  Manage invoicing and payment processing
                </p>
              </div>
            </CardContent>
          </Card>
        );

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
          isCollapsed ? "w-20" : "w-80"
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
            isCollapsed ? "p-4" : "p-6"
          } border-b border-blue-200/50`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            } mb-4`}
          >
            <div
              className={`${
                isCollapsed ? "w-12 h-12" : "w-10 h-10"
              } bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105`}
              onClick={() => router.push("/")}
            >
              <Wrench
                className={`${isCollapsed ? "h-6 w-6" : "h-5 w-5"} text-white`}
              />
            </div>
            {!isCollapsed && (
              <div
                className="flex-1 cursor-pointer"
                onClick={() => router.push("/")}
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-amber-600 transition-all">
                  Auto Serve
                </h1>
                <p className="text-sm text-slate-600">Professional Dashboard</p>
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
            {navigationItems.map((item) => (
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
                <span className="text-white font-bold text-sm">{user?.firstName?.[0] || 'U'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer for expanded state */}
        {!isCollapsed && (
          <div className="p-4 border-t border-blue-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">{user?.firstName?.[0] || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-600 truncate">{user?.shopName}</p>
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
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 capitalize">
                {currentPage}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                {currentPage === "overview"
                  ? "Welcome back! Here&apos;s what&apos;s happening at your shop today."
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
    </div>
  );
}
