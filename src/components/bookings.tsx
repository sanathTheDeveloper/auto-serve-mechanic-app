'use client'

import { useState } from 'react'

interface Appointment {
  id: number
  time: string
  customer: string
  phone: string
  email: string
  vehicle: string
  service: string
  status: 'confirmed' | 'pending' | 'cancelled'
  paymentStatus: 'paid-full' | 'deposit-paid' | 'unpaid'
  duration: string
  date: string
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Car, 
  CreditCard,
  Phone,
  Mail
} from 'lucide-react'

export function Bookings() {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const appointments: Appointment[] = [
    {
      id: 1,
      time: '9:00 AM',
      customer: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john@email.com',
      vehicle: '2019 Honda Civic',
      service: 'Oil Change + Inspection',
      status: 'confirmed' as const,
      paymentStatus: 'deposit-paid' as const,
      duration: '1 hour',
      date: '2024-01-15'
    },
    {
      id: 2,
      time: '11:30 AM',
      customer: 'Maria Garcia',
      phone: '(555) 987-6543',
      email: 'maria@email.com',
      vehicle: '2020 Toyota RAV4',
      service: 'Brake Service',
      status: 'confirmed' as const,
      paymentStatus: 'paid-full' as const,
      duration: '2 hours',
      date: '2024-01-15'
    },
    {
      id: 3,
      time: '2:00 PM',
      customer: 'Robert Johnson',
      phone: '(555) 456-7890',
      email: 'robert@email.com',
      vehicle: '2018 Ford F-150',
      service: 'Tire Rotation + Alignment',
      status: 'pending' as const,
      paymentStatus: 'unpaid' as const,
      duration: '1.5 hours',
      date: '2024-01-15'
    }
  ]

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedBooking(appointment)
    setIsDetailOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid-full': return 'bg-green-100 text-green-700'
      case 'deposit-paid': return 'bg-blue-100 text-blue-700'
      case 'unpaid': return 'bg-red-100 text-red-700'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid-full': return 'Paid in Full'
      case 'deposit-paid': return 'Deposit Paid'
      case 'unpaid': return 'Payment Pending'
      default: return 'Unknown'
    }
  }

  return (
    <div className="p-6 h-full flex">
      {/* Calendar View */}
      <div className="flex-1 pr-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Booking Management</h1>
            <p className="text-slate-600 mt-1">Manage appointments and schedule</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-slate-200 bg-white">
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
                className={viewMode === 'month' ? 'bg-primary hover:bg-primary/90 text-white' : ''}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className={viewMode === 'week' ? 'bg-primary hover:bg-primary/90 text-white' : ''}
              >
                Week
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Header */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">January 2024</h2>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                + New Booking
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Today&apos;s Appointments - January 15, 2024
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => handleAppointmentClick(appointment)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-slate-900">{appointment.time}</span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {appointment.customer}
                    </h4>
                    <p className="text-sm text-slate-600 mb-1">
                      {appointment.vehicle} • {appointment.service}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.duration}
                      </span>
                      <Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
                        {getPaymentStatusText(appointment.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Appointment Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle>Appointment Details</SheetTitle>
          </SheetHeader>
          
          {selectedBooking && (
            <div className="mt-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {selectedBooking.customer.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{selectedBooking.customer}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Phone className="h-3 w-3" />
                        {selectedBooking.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Mail className="h-3 w-3" />
                        {selectedBooking.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Information
                </h3>
                <p className="text-slate-700">{selectedBooking.vehicle}</p>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Service Details</h3>
                <div className="space-y-2">
                  <p className="text-slate-700">{selectedBooking.service}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedBooking.duration}
                    </span>
                    <span>{selectedBooking.time}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Status
                </h3>
                <Badge className={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                  {getPaymentStatusText(selectedBooking.paymentStatus)}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Edit Appointment
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    Reschedule
                  </Button>
                  <Button variant="destructive">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}