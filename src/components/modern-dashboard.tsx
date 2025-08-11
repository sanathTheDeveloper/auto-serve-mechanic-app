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
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Bookings", 
      value: "8",
      change: "2 urgent",
      trend: "neutral",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completion Rate",
      value: "96%",
      change: "+3%",
      trend: "up", 
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "124 reviews",
      trend: "up",
      icon: Star,
      color: "text-yellow-600", 
      bgColor: "bg-yellow-50"
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
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200' 
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Good morning, Mike 👋</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening at your shop today</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="shadow-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <div className="flex items-center gap-2">
                    {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                    <p className={`text-sm ${
                      metric.trend === "up" ? "text-green-600" : 
                      metric.trend === "down" ? "text-red-600" : 
                      "text-muted-foreground"
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="xl:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl font-semibold">Today&apos;s Schedule</CardTitle>
              <p className="text-sm text-muted-foreground">8 bookings • 3 in progress</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View Calendar <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center min-w-0">
                  <div className="text-sm font-semibold text-foreground">{booking.time}</div>
                  <div className="text-xs text-muted-foreground">{booking.duration}</div>
                </div>
                
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(booking.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate">{booking.customer}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0 ${getPriorityColor(booking.priority)}`}
                      >
                        {booking.bay}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{booking.vehicle}</p>
                    <p className="text-sm text-muted-foreground truncate">{booking.service}</p>
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
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Booking Requests</CardTitle>
                <p className="text-sm text-muted-foreground">{pendingRequests.length} pending</p>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {pendingRequests.filter(r => r.isUrgent).length} Urgent
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`p-3 rounded-lg border-l-4 ${
                    request.isUrgent ? 'border-l-red-400 bg-red-50/30' : 'border-l-blue-400 bg-blue-50/30'
                  } hover:bg-muted/50 transition-colors`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-foreground text-sm">{request.customer}</p>
                      <span className="text-xs text-muted-foreground">{request.requestTime}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{request.service}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold text-green-600">{request.estimate}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                          Decline
                        </Button>
                        <Button size="sm" className="h-7 px-3 text-xs bg-primary hover:bg-primary/90">
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
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.customer}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}