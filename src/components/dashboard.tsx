'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DollarSign, 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock,
  Bell
} from 'lucide-react'

export function Dashboard() {
  const bookingRequests = [
    {
      id: 1,
      customerName: 'John Doe',
      vehicle: 'Toyota Camry (2018)',
      service: 'Full Service + Oil Change',
      requestedFor: 'Tomorrow, 10:00 AM',
      isNew: true
    },
    {
      id: 2,
      customerName: 'Sarah Miller',
      vehicle: 'Honda Civic (2020)',
      service: 'Brake Pad Replacement',
      requestedFor: 'Friday, 2:30 PM',
      isNew: true
    },
    {
      id: 3,
      customerName: 'Michael Johnson',
      vehicle: 'Ford F-150 (2019)',
      service: 'Tire Rotation + Alignment',
      requestedFor: 'Saturday, 9:00 AM',
      isNew: true
    }
  ]

  const todaysSchedule = [
    {
      time: '8:30 AM',
      duration: '1.5 hrs',
      customer: 'Robert Wilson',
      vehicle: 'Nissan Altima (2017)',
      service: 'Basic Service',
      status: 'In Progress'
    },
    {
      time: '11:00 AM',
      duration: '2 hrs',
      customer: 'Jennifer Adams',
      vehicle: 'Hyundai Sonata (2021)',
      service: 'Full Service + Tire Rotation',
      status: 'Upcoming'
    },
    {
      time: '2:00 PM',
      duration: '1 hr',
      customer: 'David Lee',
      vehicle: 'Mazda CX-5 (2020)',
      service: 'Oil Change + Fluid Check',
      status: 'Upcoming'
    },
    {
      time: '4:30 PM',
      duration: '2.5 hrs',
      customer: 'Emily Chen',
      vehicle: 'Subaru Outback (2019)',
      service: 'Brake Service + Alignment',
      status: 'Upcoming'
    }
  ]

  const recentReviews = [
    {
      id: 1,
      rating: 5,
      comment: 'Great service! My car runs so much better now. Will definitely be back.',
      customerName: 'Lisa Thompson',
      timeAgo: '2 days ago',
      avatar: 'LT'
    },
    {
      id: 2,
      rating: 4,
      comment: 'Fast and efficient. Reasonable prices too.',
      customerName: 'Mark Rodriguez',
      timeAgo: '5 days ago',
      avatar: 'MR'
    },
    {
      id: 3,
      rating: 5,
      comment: 'Mike really knows his stuff. Fixed issues other shops couldn\'t figure out.',
      customerName: 'James Wilson',
      timeAgo: '1 week ago',
      avatar: 'JW'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, Mike&apos;s Auto Shop</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            + New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today&apos;s Revenue</p>
                <p className="text-2xl font-bold text-slate-900">$1,250</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  15% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Bookings This Week</p>
                <p className="text-2xl font-bold text-slate-900">24</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  4 more than last week
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Average Rating</p>
                <p className="text-2xl font-bold text-slate-900">4.8</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star 
                      key={star} 
                      className="h-3 w-3 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Booking Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">New Booking Requests</CardTitle>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            3 New
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookingRequests.map((booking) => (
            <div key={booking.id} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900">
                      {booking.customerName} - {booking.vehicle}
                    </h4>
                  </div>
                  <p className="text-slate-700 mb-1">{booking.service}</p>
                  <p className="text-sm text-slate-600">
                    Requested for: {booking.requestedFor}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Decline
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Today&apos;s Schedule</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View Full Calendar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysSchedule.map((appointment, index) => (
              <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50">
                <div className="flex flex-col items-center">
                  <div className="w-1 h-8 bg-green-500 rounded"></div>
                  <div className="text-xs text-slate-600 mt-1">{appointment.duration}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-slate-900">{appointment.time}</span>
                    <Badge 
                      variant={appointment.status === 'In Progress' ? 'default' : 'secondary'}
                      className={appointment.status === 'In Progress' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-secondary text-secondary-foreground'
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-slate-900">
                    {appointment.customer} - {appointment.vehicle}
                  </h4>
                  <p className="text-sm text-slate-600">{appointment.service}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    Deposit Paid
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Reviews</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="space-y-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= review.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-slate-300'
                      }`} 
                    />
                  ))}
                  <span className="text-sm text-slate-600 ml-2">{review.timeAgo}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  &quot;{review.comment}&quot;
                </p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-900">
                    {review.customerName}
                  </span>
                </div>
                {review.id < recentReviews.length && (
                  <div className="border-b border-slate-200 mt-4"></div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}