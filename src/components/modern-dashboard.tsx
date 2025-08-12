'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Circle,
  Filter,
  MoreHorizontal
} from 'lucide-react'

export function ModernDashboard() {
  const metrics = [
    {
      title: "Today&apos;s Revenue",
      value: "$1,250",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-100"
    },
    {
      title: "Active Bookings", 
      value: "8",
      change: "2 urgent",
      trend: "neutral",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-sky-100"
    },
    {
      title: "Completion Rate",
      value: "96%",
      change: "+3%",
      trend: "up", 
      icon: CheckCircle,
      color: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "124 reviews",
      trend: "up",
      icon: Star,
      color: "text-amber-500", 
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-100"
    }
  ]

  const upcomingBookings = [
    {
      id: 1,
      time: "9:00 AM",
      customer: "Sarah Johnson",
      vehicle: "2020 Honda Civic",
      service: "Oil Change + Inspection",
      status: "confirmed",
      duration: "45m",
      priority: "normal",
      bay: "Bay 2"
    },
    {
      id: 2,
      time: "10:30 AM", 
      customer: "Mike Rodriguez",
      vehicle: "2018 Ford F-150",
      service: "Brake Service",
      status: "urgent",
      duration: "2h",
      priority: "high",
      bay: "Bay 1"
    },
    {
      id: 3,
      time: "1:00 PM",
      customer: "Lisa Chen", 
      vehicle: "2021 Tesla Model 3",
      service: "Tire Rotation",
      status: "confirmed",
      duration: "30m",
      priority: "normal", 
      bay: "Bay 3"
    },
    {
      id: 4,
      time: "2:30 PM",
      customer: "John Davis",
      vehicle: "2019 BMW X3", 
      service: "Engine Diagnostic",
      status: "pending",
      duration: "1.5h",
      priority: "normal",
      bay: "Bay 4"
    }
  ]

  const pendingRequests = [
    {
      id: 1,
      customer: "Emma Wilson",
      vehicle: "2017 Toyota Camry", 
      service: "Full Service",
      requestTime: "2 hours ago",
      preferredDate: "Tomorrow, 10:00 AM",
      estimate: "$180",
      isUrgent: false
    },
    {
      id: 2,
      customer: "David Kim",
      vehicle: "2020 Subaru Outback",
      service: "A/C Repair",
      requestTime: "4 hours ago", 
      preferredDate: "Friday, 2:00 PM",
      estimate: "$320",
      isUrgent: true
    },
    {
      id: 3,
      customer: "Rachel Green",
      vehicle: "2018 Mazda CX-5",
      service: "Brake Inspection",
      requestTime: "1 day ago",
      preferredDate: "Next week",
      estimate: "$85",
      isUrgent: false
    }
  ]

  const recentActivity = [
    { action: "Booking completed", customer: "Tom Wilson", time: "10 min ago", type: "success" },
    { action: "Payment received", customer: "Anna Davis", time: "25 min ago", type: "success" },
    { action: "New review posted", customer: "James Miller", time: "1 hour ago", type: "info" },
    { action: "Booking rescheduled", customer: "Mary Johnson", time: "2 hours ago", type: "warning" }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-amber-600 bg-gradient-to-r from-amber-50 to-orange-100 border-amber-200'
      case 'normal': return 'text-blue-600 bg-gradient-to-r from-blue-50 to-sky-100 border-blue-200' 
      default: return 'text-slate-600 bg-gradient-to-r from-slate-50 to-gray-100 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'urgent': return <AlertCircle className="h-4 w-4 text-amber-500" />
      case 'pending': return <Clock className="h-4 w-4 text-orange-400" />
      default: return <Circle className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent">Good morning, Mike 👋</h1>
          <p className="text-slate-600 mt-1">Here&apos;s what&apos;s happening at your shop today</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-blue-200 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                  <div className="flex items-center gap-2">
                    {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-blue-500" />}
                    <p className={`text-sm ${
                      metric.trend === "up" ? "text-blue-600" : 
                      metric.trend === "down" ? "text-amber-600" : 
                      "text-slate-500"
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="xl:col-span-2 bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">Today&apos;s Schedule</CardTitle>
              <p className="text-sm text-slate-500">8 bookings • 3 in progress</p>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50">
              View Calendar <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="flex items-center gap-4 p-4 rounded-lg border border-blue-200/30 bg-gradient-to-r from-blue-50/50 to-orange-50/50 hover:from-blue-100/50 hover:to-orange-100/50 transition-all duration-300 cursor-pointer backdrop-blur-sm"
              >
                <div className="flex flex-col items-center min-w-0">
                  <div className="text-sm font-semibold text-slate-700">{booking.time}</div>
                  <div className="text-xs text-slate-500">{booking.duration}</div>
                </div>
                
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(booking.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-slate-800 truncate">{booking.customer}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0 border-0 shadow-sm ${getPriorityColor(booking.priority)}`}
                      >
                        {booking.bay}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{booking.vehicle}</p>
                    <p className="text-sm text-slate-600 truncate">{booking.service}</p>
                  </div>
                </div>

                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">Booking Requests</CardTitle>
                <p className="text-sm text-slate-500">{pendingRequests.length} pending</p>
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 border-0 shadow-sm">
                {pendingRequests.filter(r => r.isUrgent).length} Urgent
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`p-3 rounded-lg border-l-4 ${
                    request.isUrgent ? 'border-l-amber-400 bg-gradient-to-r from-amber-50/50 to-orange-50/50' : 'border-l-blue-400 bg-gradient-to-r from-blue-50/50 to-sky-50/50'
                  } hover:shadow-md transition-all duration-300 backdrop-blur-sm`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-slate-800 text-sm">{request.customer}</p>
                      <span className="text-xs text-slate-500">{request.requestTime}</span>
                    </div>
                    <p className="text-sm text-slate-600">{request.vehicle}</p>
                    <p className="text-sm text-slate-600">{request.service}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold text-blue-600">{request.estimate}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-slate-300 text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50">
                          Decline
                        </Button>
                        <Button size="sm" className="h-7 px-3 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-orange-50/50 transition-all duration-300">
                  <div className={`w-2 h-2 rounded-full shadow-sm ${
                    activity.type === 'success' ? 'bg-blue-500' :
                    activity.type === 'warning' ? 'bg-amber-500' :
                    'bg-blue-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.customer}</p>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}